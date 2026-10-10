import { NextRequest, NextResponse } from 'next/server';

// Judge0 Language IDs (verified with https://ce.judge0.com/languages)
const JUDGE0_LANGUAGE_MAP: Record<string, number> = {
  c: 103, // C (GCC 14.1.0)
  cpp: 105, // C++ (GCC 14.1.0)
  java: 91, // Java (JDK 17.0.6)
  python: 100, // Python (3.12.5)
  javascript: 102, // JavaScript (Node.js 22.08.0)
};

// Fallback Language IDs (older stable GCC/Clang if 14.1.0 has transient load)
const JUDGE0_FALLBACK_MAP: Record<string, number> = {
  c: 50, // C (GCC 9.2.0)
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
};

/**
 * Prepares source code for compilation.
 * If students paste code snippets without int main() (C/C++) or class Main (Java),
 * this automatically wraps the snippet so beginners get working execution instead of
 * cryptic compilation errors, while preserving exact line numbering using #line directives.
 */
function prepareSourceCode(
  langKey: string,
  rawCode: string
): { preparedCode: string; wasAutoWrapped: boolean } {
  // If code already defines a main function, execute as-is
  if (/\bmain\s*\(/.test(rawCode)) {
    if (langKey === 'java') {
      let javaCode = rawCode;
      if (!/\bclass\s+Main\b/.test(rawCode)) {
        javaCode = javaCode.replace(/\bpublic\s+class\s+([A-Za-z0-9_]+)/, 'class $1');
      }
      return { preparedCode: javaCode, wasAutoWrapped: false };
    }
    return { preparedCode: rawCode, wasAutoWrapped: false };
  }

  // Handle C and C++ snippets that omit int main()
  if (langKey === 'c' || langKey === 'cpp') {
    const lines = rawCode.split('\n');
    const directives: string[] = [];
    const topFunctions: string[] = [];
    const bodyStatements: string[] = [];

    let inFunction = false;
    let braceDepth = 0;
    let currentFuncLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!inFunction && (trimmed.startsWith('#') || trimmed.startsWith('using namespace '))) {
        directives.push(line);
        continue;
      }

      // Check if line looks like top-level function or class/struct definition
      if (
        !inFunction &&
        /^\s*(?:(?:template\s*<[^>]+>\s*)*(?:inline\s+|static\s+|constexpr\s+)*(?:void|int|long|double|float|bool|char|string|auto|[A-Z][A-Za-z0-9_]*)\s+[A-Za-z0-9_]+\s*\([^;]*\)|(?:struct|class)\s+[A-Za-z0-9_]+)\s*\{?/.test(
          line
        )
      ) {
        inFunction = true;
        currentFuncLines = [line];
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceDepth = openBraces - closeBraces;
        if (braceDepth <= 0 && line.includes('{') && line.includes('}')) {
          inFunction = false;
          topFunctions.push(currentFuncLines.join('\n'));
          currentFuncLines = [];
        }
        continue;
      }

      if (inFunction) {
        currentFuncLines.push(line);
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceDepth += openBraces - closeBraces;
        if (braceDepth <= 0) {
          inFunction = false;
          topFunctions.push(currentFuncLines.join('\n'));
          currentFuncLines = [];
        }
        continue;
      }

      bodyStatements.push(line);
    }

    const hasStdio = /#include\s*<stdio\.h>/.test(rawCode);
    const hasIostream = /#include\s*<iostream>/.test(rawCode);

    let defaultHeaders = '';
    if (langKey === 'c') {
      defaultHeaders = [
        hasStdio ? '' : '#include <stdio.h>',
        '#include <stdlib.h>',
        '#include <string.h>',
        '#include <math.h>',
      ]
        .filter(Boolean)
        .join('\n');
    } else {
      defaultHeaders = [
        hasIostream ? '' : '#include <iostream>',
        '#include <vector>',
        '#include <string>',
        '#include <algorithm>',
        '#include <cmath>',
        '#include <cstdio>',
        rawCode.includes('using namespace std;') ? '' : 'using namespace std;',
      ]
        .filter(Boolean)
        .join('\n');
    }

    const filename = langKey === 'c' ? 'main.c' : 'main.cpp';
    const headerBlock = [defaultHeaders, ...directives].filter(Boolean).join('\n');
    const functionsBlock = topFunctions.join('\n\n');
    const bodyBlock = bodyStatements.join('\n');

    const wrapped = `${headerBlock}\n\n${functionsBlock ? functionsBlock + '\n\n' : ''}int main() {\n#line 1 "${filename}"\n${bodyBlock}\n    return 0;\n}\n`;
    return { preparedCode: wrapped, wasAutoWrapped: true };
  }

  // Handle Java snippets missing class / main()
  if (langKey === 'java') {
    const lines = rawCode.split('\n');
    const imports: string[] = [];
    const bodyLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('import ') || trimmed.startsWith('package ')) {
        imports.push(line);
        bodyLines.push('');
      } else {
        bodyLines.push(line);
      }
    }

    const importPart = ['import java.util.*;', 'import java.io.*;', ...imports]
      .filter(Boolean)
      .join('\n');

    const wrapped = `${importPart}\n\npublic class Main {\n  public static void main(String[] args) {\n${bodyLines.join('\n')}\n  }\n}\n`;
    return { preparedCode: wrapped, wasAutoWrapped: true };
  }

  return { preparedCode: rawCode, wasAutoWrapped: false };
}

function safeBase64Decode(val: unknown): string {
  if (typeof val !== 'string' || !val) return '';
  try {
    return Buffer.from(val, 'base64').toString('utf-8');
  } catch {
    return val;
  }
}

// Compiler optimization flags
const COMPILER_OPTIONS_MAP: Record<string, string> = {
  c: '-O2 -lm', // Level 2 optimization + link math library (libm) for sqrt, pow, sin, cos
  cpp: '-O2',   // Level 2 optimization for modern C++ execution
};

export async function POST(req: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await req.json();
    const { language, code, stdin = '' } = body;

    if (!language || typeof code !== 'string') {
      return NextResponse.json(
        {
          success: false,
          stdout: '',
          stderr: 'Language and code are required.',
          exitCode: -1,
          elapsedMs: 0,
        },
        { status: 400 }
      );
    }

    const langKey = String(language).toLowerCase();
    const langId = JUDGE0_LANGUAGE_MAP[langKey];

    if (!langId) {
      return NextResponse.json(
        {
          success: false,
          stdout: '',
          stderr: `Remote compiler execution is not configured for '${language}'.`,
          exitCode: -1,
          elapsedMs: 0,
        },
        { status: 400 }
      );
    }

    const { preparedCode, wasAutoWrapped } = prepareSourceCode(langKey, code);

    // Encode source_code and stdin to base64 to ensure 100% full UTF-8 support
    // (emojis like 🚀, ✅, Hindi, Unicode symbols, non-ASCII characters)
    const b64Source = Buffer.from(preparedCode, 'utf-8').toString('base64');
    const b64Stdin = Buffer.from(stdin || '', 'utf-8').toString('base64');
    const compilerOpts = COMPILER_OPTIONS_MAP[langKey];

    const submissionPayload = {
      language_id: langId,
      source_code: b64Source,
      stdin: b64Stdin,
      ...(compilerOpts ? { compiler_options: compilerOpts } : {}),
      cpu_time_limit: 5,
      memory_limit: 128000,
    };

    // Call Judge0 CE API with 20-second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    let res: Response | null = null;
    try {
      res = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(submissionPayload),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      // If primary language ID failed, attempt fallback compiler ID
      const fallbackId = JUDGE0_FALLBACK_MAP[langKey];
      if (fallbackId && fallbackId !== langId) {
        try {
          res = await fetch('https://ce.judge0.com/submissions?base64_encoded=true&wait=true', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              ...submissionPayload,
              language_id: fallbackId,
            }),
            signal: controller.signal,
          });
        } catch {
          // Both failed
        }
      }
      if (!res) throw fetchErr;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!res || !res.ok) {
      const errText = res ? await res.text() : 'No response from compiler service';
      throw new Error(`Compiler service error (${res?.status || 500}): ${errText}`);
    }

    const data = await res.json();
    const elapsedMs = Math.round(performance.now() - startTime);

    const statusId = data.status?.id ?? 0;
    const statusDesc = data.status?.description ?? '';
    const stdout = safeBase64Decode(data.stdout).trimEnd();
    const stderr = safeBase64Decode(data.stderr).trimEnd();
    const compileOutput = safeBase64Decode(data.compile_output).trimEnd();

    // Judge0 status IDs:
    // 3 = Accepted
    // 6 = Compilation Error
    // 5 = Time Limit Exceeded
    // 7-12 = Runtime Error
    const isSuccess = statusId === 3;
    const exitCode = isSuccess ? 0 : statusId === 6 ? 1 : data.exit_code ?? 1;

    let finalStderr = stderr;
    if (statusId === 5) {
      finalStderr = finalStderr ? `${finalStderr}\nTime Limit Exceeded (5.0s)` : 'Time Limit Exceeded (5.0s)';
    } else if (statusId >= 7 && statusId <= 12) {
      finalStderr = finalStderr ? `${finalStderr}\nRuntime Error: ${statusDesc}` : `Runtime Error: ${statusDesc}`;
    }

    return NextResponse.json({
      success: isSuccess,
      stdout,
      stderr: finalStderr,
      compilerError: compileOutput || undefined,
      exitCode,
      elapsedMs,
      time: data.time,
      memoryKb: data.memory,
      status: statusDesc,
      wasAutoWrapped,
    });
  } catch (err: unknown) {
    const elapsedMs = Math.round(performance.now() - startTime);
    if (err instanceof Error && err.name === 'AbortError') {
      return NextResponse.json(
        {
          success: false,
          stdout: '',
          stderr: 'Compilation / Execution timed out after 20 seconds.',
          exitCode: -1,
          elapsedMs,
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        stdout: '',
        stderr: `Execution error: ${err instanceof Error ? err.message : String(err)}`,
        exitCode: -1,
        elapsedMs,
      },
      { status: 500 }
    );
  }
}
