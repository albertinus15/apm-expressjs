# Elastic APM Demo dengan Docker

Mini project ini berisi aplikasi demo Node.js yang diintegrasikan dengan Elastic APM (Application Performance Monitoring) menggunakan Docker.

## Komponen

- **Node.js Application**: Aplikasi Express.js sederhana dengan berbagai endpoint untuk mensimulasikan berbagai kondisi beban dan error
- **Elastic APM Server**: Menerima data metrik performa dari aplikasi
- **Elasticsearch**: Menyimpan data metrik dan traces
- **Kibana**: Visualisasi data monitoring
- **Load Generator**: Menghasilkan traffic simulasi ke aplikasi

## Persyaratan

- Docker dan Docker Compose terinstal di sistem Anda
- Minimal 4GB RAM tersedia untuk Docker

## Cara Menjalankan

1. Clone repository ini
2. Jalankan seluruh stack dengan Docker Compose:

```bash
docker-compose up -d
```

3. Tunggu beberapa menit hingga semua layanan berjalan dengan baik
4. Akses aplikasi demo di http://localhost:3000
5. Akses Kibana di http://localhost:5601

## Membuka Dashboard APM di Kibana

1. Buka Kibana di http://localhost:5601
2. Klik menu "Observability" di sidebar kiri
3. Pilih "APM"
4. Anda akan melihat aplikasi "demo-app" yang sedang dimonitor

## Endpoint Aplikasi Demo

Aplikasi demo menyediakan beberapa endpoint untuk mensimulasikan berbagai kondisi:

- `GET /`: Homepage sederhana
- `GET /slow`: Endpoint dengan delay 2 detik
- `GET /error`: Endpoint yang menghasilkan error
- `GET /cpu-intensive`: Endpoint yang mensimulasikan operasi CPU intensif
- `GET /memory-intensive`: Endpoint yang mensimulasikan penggunaan memori tinggi
- `GET /api/products`: Mendapatkan semua produk
- `GET /api/products/:id`: Mendapatkan produk berdasarkan ID
- `POST /api/products`: Menambahkan produk baru
- `DELETE /api/products/:id`: Menghapus produk
- `GET /api/external-service`: Mensimulasikan panggilan ke layanan eksternal

## Menghentikan Stack

Untuk menghentikan dan membersihkan stack:

```bash
docker-compose down
```

Jika ingin menghapus volume Elasticsearch:

```bash
docker-compose down -v
```