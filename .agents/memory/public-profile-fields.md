---
name: Public profile fields
description: How profile intelligence commands should handle optional social-profile metadata.
---

Social-profile APIs expose an inconsistent subset of public fields and may return a webpage URL under profileUrl rather than an image. Treat metadata as optional, filter image candidates by URL shape, and display an explicit unavailable value when absent; never invent profile facts.

**Why:** The bot can receive name, gender, profile URL, and avatar while omitting custom bio fields, and local cached user data may be incomplete or stale.

**How to apply:** Merge live profile data with local data, prefer live values, map known aliases, and keep the card layout resilient to missing or long values.