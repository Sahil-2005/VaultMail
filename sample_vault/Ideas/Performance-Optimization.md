---
tags: [ideas, performance]
---
# Performance Optimization

- Currently, our embeddings run locally with `all-MiniLM-L6-v2`. It takes about 80ms per chunk.
- If we scale up, we might need to move this to a dedicated inference server or use a smaller quantized model.
- Our Qdrant instance is on the free tier (1GB). We should monitor the storage usage.
