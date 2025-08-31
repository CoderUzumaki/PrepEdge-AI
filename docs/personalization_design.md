\# AI-Driven Personalized Learning Path — Design Doc



\## Overview

This feature dynamically generates a personalized learning path for each user by detecting topic-wise weaknesses based on their performance and activity history.



\## Goals

\- Detect weak areas using performance analytics.

\- Recommend weekly personalized goals.

\- Increase engagement and retention.

\- Deliver smarter preparation paths via AI.



\## Scope (MVP)

\- Weakness detection using rule-based scoring.

\- Weekly roadmap with:

&nbsp; - 2–3 weak topics to focus on.

&nbsp; - Practice problems \& concept resources.

&nbsp; - Progress tracking.



\## Data Schema

\*\*Events\*\*

```json

{

&nbsp; "user\_id": "string",

&nbsp; "activity\_type": "quiz|coding|mock",

&nbsp; "topic": "arrays|dp|graphs|system-design",

&nbsp; "subtopic": "two-pointer",

&nbsp; "timestamp": "ISO8601",

&nbsp; "accuracy": 0.85,

&nbsp; "time\_taken\_seconds": 120,

&nbsp; "attempts": 1,

&nbsp; "difficulty": "easy|medium|hard",

&nbsp; "exercise\_id": "string"

}



