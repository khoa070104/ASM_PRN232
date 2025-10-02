## Tài liệu API

### Ghi chú chung
- Base URL: phụ thuộc cấu hình `launchSettings.json` (ví dụ: `https://localhost:5001` hoặc `http://localhost:5000`).
- Tất cả response là JSON.
- Lỗi chuẩn do middleware trả về:

```json
{
  "error": "ERROR_CODE",
  "message": "Mô tả lỗi"
}
```

- Với lỗi nghiệp vụ (AppException): mã trạng thái theo `ex.StatusCode`, thân lỗi theo mẫu trên với `error = ex.ErrorCode`, `message = ex.Message`.
- Với lỗi không xác định: HTTP 500, `{ "error": "INTERNAL_ERROR", "message": "Unexpected error" }`.

---

### Products API
- Base route: `/api/Products`

1) GET `/api/Products`
- Mô tả: Lấy danh sách sản phẩm
- Query: không
- Request body: không
- Response 200: `ProductReadDto[]`

```json
[
  {
    "id": "00000000-0000-0000-0000-000000000000",
    "name": "string",
    "description": "string",
    "price": 0,
    "image": "string|null",
    "createdAtUtc": "2025-01-01T00:00:00Z",
    "updatedAtUtc": "2025-01-02T00:00:00Z|null"
  }
]
```

2) GET `/api/Products/{id}`
- Mô tả: Lấy chi tiết sản phẩm theo `id`
- Path params:
  - `id` (Guid, bắt buộc)
- Request body: không
- Response 200: `ProductReadDto`
- Lỗi có thể gặp: 404 (AppException tuỳ implement service), 400 nếu `id` không hợp lệ

```json
{
  "id": "00000000-0000-0000-0000-000000000000",
  "name": "string",
  "description": "string",
  "price": 0,
  "image": "string|null",
  "createdAtUtc": "2025-01-01T00:00:00Z",
  "updatedAtUtc": "2025-01-02T00:00:00Z|null"
}
```

3) POST `/api/Products`
- Mô tả: Tạo sản phẩm
- Request body: `ProductCreateDto`

```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "image": "string|null"
}
```

- Response 201: `ProductReadDto` (kèm header Location trỏ tới `GET /api/Products/{id}`)
- Lỗi có thể gặp: 400 (validation), 409/422 (tuỳ nghiệp vụ)

4) PUT `/api/Products/{id}`
- Mô tả: Cập nhật sản phẩm
- Path params:
  - `id` (Guid, bắt buộc)
- Request body: `ProductUpdateDto`

```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "image": "string|null"
}
```

- Response 200: `ProductReadDto`
- Lỗi có thể gặp: 400 (validation), 404 (không tìm thấy)

5) DELETE `/api/Products/{id}`
- Mô tả: Xoá sản phẩm
- Path params:
  - `id` (Guid, bắt buộc)
- Request body: không
- Response 204: không có nội dung
- Lỗi có thể gặp: 404 (không tìm thấy)

---

### WeatherForecast API (Api project)
- Base route: `/WeatherForecast`

1) GET `/WeatherForecast`
- Mô tả: Lấy danh sách dự báo thời tiết mẫu
- Request body: không
- Response 200: `WeatherForecast[]`

```json
[
  {
    "date": "2025-01-01",
    "temperatureC": 0,
    "temperatureF": 32,
    "summary": "string|null"
  }
]
```

Ghi chú: `temperatureF` là thuộc tính tính toán từ `temperatureC`.

---

### WeatherForecast API (Web-BE project mẫu)
- Base route: `/WeatherForecast`
- Lưu ý: Đây là project mẫu khác (`Web-BE/Web-BE`), cấu trúc response tương tự như trên.

1) GET `/WeatherForecast`
- Response 200: `WeatherForecast[]` cùng schema với phần trên.

---

### DTO/Schema tham chiếu
- `ProductCreateDto`

```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "image": "string|null"
}
```

- `ProductUpdateDto`: giống `ProductCreateDto`.

- `ProductReadDto`

```json
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "price": 0,
  "image": "string|null",
  "createdAtUtc": "ISO-8601",
  "updatedAtUtc": "ISO-8601|null"
}
```

- `WeatherForecast`

```json
{
  "date": "yyyy-MM-dd",
  "temperatureC": 0,
  "temperatureF": 0,
  "summary": "string|null"
}
```

---

### Mã trạng thái HTTP chuẩn
- 200 OK: Truy vấn thành công / cập nhật thành công
- 201 Created: Tạo mới thành công
- 204 No Content: Xoá thành công
- 400 Bad Request: Dữ liệu không hợp lệ
- 404 Not Found: Không tìm thấy tài nguyên
- 409 Conflict / 422 Unprocessable Entity: Tuỳ nghiệp vụ
- 500 Internal Server Error: Lỗi hệ thống không xác định


