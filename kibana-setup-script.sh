#!/bin/bash

# Script untuk menginisialisasi kebijakan Fleet dan APM di Kibana
# Simpan sebagai setup-fleet.sh dan jalankan setelah stack siap

# Kredensial Elastic
ELASTIC_USER="elastic"
ELASTIC_PASS="changeme"
KIBANA_URL="http://localhost:5601"

# Fungsi untuk menunggu Kibana siap
wait_for_kibana() {
  echo "Menunggu Kibana siap..."
  max_retries=30
  retries=0
  
  while [ $retries -lt $max_retries ]; do
    if curl -s -u "$ELASTIC_USER:$ELASTIC_PASS" "$KIBANA_URL/api/status" | grep -q '"overall":{"level":"available"'; then
      echo "Kibana siap!"
      return 0
    fi
    
    retries=$((retries+1))
    echo "Menunggu Kibana... $retries/$max_retries"
    sleep 10
  done
  
  echo "Kibana tidak siap setelah $max_retries percobaan."
  return 1
}

# Fungsi untuk mengaktifkan Fleet Server
enable_fleet() {
  echo "Mengaktifkan integrasi Fleet Server..."
  
  # Mendapatkan token dari API Kibana
  curl -X POST -u "$ELASTIC_USER:$ELASTIC_PASS" \
    -H "Content-Type: application/json" \
    -H "kbn-xsrf: true" \
    "$KIBANA_URL/api/fleet/setup" \
    -d '{"forceRecreate": false}'
  
  echo -e "\nSetup Fleet selesai!"
}

# Fungsi untuk memastikan kebijakan default ada
ensure_default_policy() {
  echo "Memastikan kebijakan default Fleet sudah ada..."
  
  # Cek apakah kebijakan default sudah ada
  if curl -s -u "$ELASTIC_USER:$ELASTIC_PASS" \
     "$KIBANA_URL/api/fleet/agent_policies" | grep -q "Default policy"; then
    echo "Kebijakan default sudah ada."
  else
    echo "Membuat kebijakan default baru..."
    curl -X POST -u "$ELASTIC_USER:$ELASTIC_PASS" \
      -H "Content-Type: application/json" \
      -H "kbn-xsrf: true" \
      "$KIBANA_URL/api/fleet/agent_policies" \
      -d '{
        "name": "Default policy",
        "description": "Default policy for Fleet",
        "namespace": "default",
        "monitoring_enabled": ["logs", "metrics"]
      }'
  fi
}

# Jalankan semua langkah setup
main() {
  echo "Memulai setup Fleet dan APM..."
  
  # Tunggu Kibana siap
  wait_for_kibana || exit 1
  
  # Aktifkan Fleet
  enable_fleet
  
  # Pastikan kebijakan default sudah dibuat
  ensure_default_policy
  
  echo "Setup selesai! Anda sekarang dapat menggunakan Fleet di Kibana."
  echo "Buka $KIBANA_URL/app/fleet untuk mengakses Fleet."
}

# Jalankan fungsi utama
main