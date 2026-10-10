# AI Insights & Azure Cognitive Services Integration

Modern business data is not restricted to clean numbers. Enterprises capture millions of lines of **unstructured data**:
- Customer support ticket transcripts
- Online product reviews and social media feedback
- Survey responses and employee comments

Using **AI Insights & Azure Cognitive Services** inside Power BI, developers can extract sentiment scores, detect languages, and identify key phrases directly during data transformation!

---

## 1. The Pre-Trained AI Capabilities in Power BI

Power BI includes pre-built connectors to Azure Cognitive Services requiring **zero machine learning coding**:

```
                       Unstructured Data Processing
                                     |
               +---------------------+---------------------+
               |                                           |
    [Sentiment Analysis]                         [Key Phrase Extraction]
  - Scores text from 0 (Negative)              - Extracts core topics & nouns
    to 1.0 (Positive)                          - Example: "slow shipping",
  - Example: "Great product, fast               "damaged box", "friendly staff"
    delivery!" --> Score: 0.94                 - Used to populate Word Clouds
```

---

## 2. Running AI Insights in Power Query

1. In **Power Query Editor**, select your query containing text comments (e.g., `CustomerFeedback`).
2. On the **Add Column** ribbon tab, click **AI Insights** (or **Text Analytics**).
3. Choose the target transformation:
   - **Score sentiment:** Evaluates customer satisfaction.
   - **Extract key phrases:** Extracts prominent subject words.
   - **Detect language:** Identifies the language code (e.g., `en`, `es`, `hi`).
4. Select the source text column (e.g., `ReviewComment`).
5. Click **OK**. Power BI evaluates the text using Azure AI models and outputs a structured sentiment score column!

---

## 3. Visualizing Sentiment & Key Phrases

Once scored:
- Plot average sentiment score over time to monitor customer happiness trends.
- Use **Word Clouds** or Treemaps to display the most frequent key phrases associated with negative sentiment scores ($< 0.30$), immediately highlighting product defects or shipping bottlenecks!

---

# Multiple Choice Questions

### 1. What numerical range does the Azure Cognitive Services Sentiment Analysis model output in Power BI?
A. -100 to +100
B. 0.0 (Extremely Negative) to 1.0 (Extremely Positive)
C. 1 to 5 stars
D. 0 to 100%
**Answer:** B
**Explanation:** Sentiment scores range continuously between 0 and 1, where values near 0 represent negative sentiment, 0.5 represents neutral, and values near 1 represent positive sentiment.

### 2. Which AI Insights capability automatically identifies the primary topics and recurring issues (such as "broken latch" or "delayed delivery") from raw text comments?
A. Key Phrase Extraction
B. Language Detection
C. Image Tagging
D. Quick Measures
**Answer:** A
**Explanation:** Key Phrase Extraction isolates salient words and noun phrases, enabling analysts to identify recurring themes across thousands of freeform text feedback rows.

### 3. Where is the "AI Insights" / "Text Analytics" suite accessed in Power BI?
A. In the Windows Control Panel
B. Under the Add Column or Home ribbon tab in Power Query Editor
C. In Microsoft Word
D. In the Bookmark pane
**Answer:** B
**Explanation:** AI Insights (Text Analytics, Vision, and Azure ML) is integrated directly into Power Query Editor, allowing AI models to enrich data during the ETL pipeline.

### 4. What license capacity is required to run native Power BI AI Insights (Text Analytics) without an external Azure API subscription?
A. Power BI Free
B. Power BI Premium, Premium Per User (PPU), or Microsoft Fabric capacity
C. Windows Home
D. Excel Starter
**Answer:** B
**Explanation:** Native execution of Text Analytics and Vision models within Power BI requires Premium (PPU or Capacity) or Fabric capacity.

### 5. How can an analyst combine Sentiment Analysis with Key Phrase Extraction to uncover operational bottlenecks?
A. By deleting negative reviews
B. By filtering key phrases strictly to feedback rows where the Sentiment Score is under 0.30, pinpointing the exact terminology associated with dissatisfied customers
C. By changing chart fonts
D. By exporting to text files
**Answer:** B
**Explanation:** Cross-filtering key phrases by low sentiment scores isolates the specific issues causing customer dissatisfaction (e.g., shipping delays, customer service wait times).

---
