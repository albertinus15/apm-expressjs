#!/bin/bash

# Script untuk membuat service account token di Elasticsearch
# Simpan sebagai elasticsearch-init.sh

# Tunggu Elasticsearch ready
echo "Menunggu Elasticsearch siap..."
until curl -s -f -u elastic:changeme http://localhost:9200/_cluster/health?wait_for_status=yellow > /dev/null; do
    echo "Menunggu Elasticsearch..."
    sleep 5
done
echo "Elasticsearch siap."

# Buat service account token untuk Kibana
echo "Membuat service account token untuk Kibana..."
KIBANA_TOKEN=$(curl -s -X POST -u elastic:changeme \
    -H "Content-Type: application/json" \
    http://localhost:9200/_security/service/elastic/kibana/credential/token/kibana_system_token \
    | grep -o '"value":"[^"]*"' | cut -d'"' -f4)

if [ -n "$KIBANA_TOKEN" ]; then
    echo "Token berhasil dibuat: $KIBANA_TOKEN"
    
    # Ekspor token sebagai variable environment
    echo "ELASTICSEARCH_SERVICEACCOUNTTOKEN=$KIBANA_TOKEN" > .env
    
    # Update docker-compose
    echo "Memperbarui docker-compose dengan token..."
    sed -i "s/- ELASTICSEARCH_SERVICEACCOUNTTOKEN=kibana_system_token/- ELASTICSEARCH_SERVICEACCOUNTTOKEN=$KIBANA_TOKEN/g" docker-compose.yml
    
    echo "Token berhasil diupdate di docker-compose.yml"
    echo "Anda dapat me-restart Kibana sekarang: docker-compose restart kibana"
else
    echo "Gagal membuat token. Periksa log error."
fi