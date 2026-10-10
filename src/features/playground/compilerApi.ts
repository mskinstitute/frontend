import { SupportedLanguage } from './types';

export interface RemoteExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  compilerError?: string;
  exitCode: number;
  elapsedMs: number;
  time?: string;
  memoryKb?: number;
  wasAutoWrapped?: boolean;
}

/**
 * Executes C, C++, or Java code via internal /api/compile (powered by GCC / Judge0)
 */
export async function runRemoteCode(
  language: SupportedLanguage,
  code: string,
  stdin: string = ''
): Promise<RemoteExecutionResult> {
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

    const response = await fetch('/api/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language,
        code,
        stdin: stdin || '',
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return {
        success: Boolean(data.success),
        stdout: data.stdout || '',
        stderr: data.stderr || '',
        compilerError: data.compilerError || undefined,
        exitCode: typeof data.exitCode === 'number' ? data.exitCode : 0,
        elapsedMs: typeof data.elapsedMs === 'number' ? data.elapsedMs : Math.round(performance.now() - startTime),
        time: data.time,
        memoryKb: data.memoryKb,
        wasAutoWrapped: Boolean(data.wasAutoWrapped),
      };
    }

    const errData = await response.json().catch(() => null);
    throw new Error(errData?.stderr || `Compiler API error (HTTP ${response.status})`);
  } catch (err: unknown) {
    const elapsedMs = Math.round(performance.now() - startTime);

    if (err instanceof Error && err.name === 'AbortError') {
      return {
        success: false,
        stdout: '',
        stderr: 'Compilation / Execution timed out after 25 seconds.',
        exitCode: -1,
        elapsedMs,
      };
    }

    return {
      success: false,
      stdout: '',
      stderr: `Execution failed: ${err instanceof Error ? err.message : String(err)}`,
      exitCode: -1,
      elapsedMs,
    };
  }
}
