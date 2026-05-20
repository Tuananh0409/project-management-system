# `src/components`

Đây là **điểm vào (barrel)** cho toàn bộ component dùng lại trong app.

- **Triển khai thật** nằm trong [`../shared/components`](../shared/components): `layout/`, `ui/`, `feedback/`, `icons/`.
- **Feature** (workspace, auth, …) giữ component riêng trong `src/features/.../components`.

Ví dụ:

```ts
import { Button, Modal, AppShell } from "@/components";
// tương đương
import { Button } from "@/shared/components/ui/Button";
```
