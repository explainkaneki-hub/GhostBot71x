---
name: Reply wrapper safety
description: Durable constraints for command-level message styling and unsend behavior.
---

Command-level wrappers around FCA reply/send methods must only schedule unsend when an explicit positive unsend duration exists, must call the underlying send exactly once, and must restore the original methods on both success and failure.

**Why:** A zero-duration unsend can make styled replies disappear immediately, duplicate callback-style sends can produce inconsistent delivery, and leaked wrappers stack across later commands.

**How to apply:** Keep this logic in the application handler layer; do not modify the FCA core. Test both promise and callback-style send paths after changing it.