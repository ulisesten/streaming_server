#!/bin/bash

DOMAIN="${1:-localhost}"
DAYS="${2:-365}"
KEY_ALGORITHM="${3:-gost2012_256}"

echo "Generando certificado GOST para: $DOMAIN"
echo "Algoritmo: $KEY_ALGORITHM"
echo "Días de validez: $DAYS"

# Generar clave privada
echo "1. Generando clave privada..."
openssl genpkey -algorithm $KEY_ALGORITHM -pkeyopt paramset:A -out ${DOMAIN}-gost-key.pem

# Generar CSR
echo "2. Generando Certificate Signing Request..."
openssl req -new -key ${DOMAIN}-gost-key.pem -engine gost -keyform PEM -out ${DOMAIN}-gost-request.csr -subj "/C=RU/ST=Moscow/L=Moscow/O=My Company/OU=IT/CN=${DOMAIN}"

# Generar certificado autofirmado
echo "3. Generando certificado autofirmado..."
openssl x509 -req -days $DAYS -in ${DOMAIN}-gost-request.csr -signkey ${DOMAIN}-gost-key.pem -engine gost -out ${DOMAIN}-gost-certificate.crt -extfile <(echo -e "basicConstraints=critical,CA:true\nkeyUsage=digitalSignature,keyEncipherment,keyCertSign\nextendedKeyUsage=serverAuth,clientAuth")

# Crear bundle (certificado + clave)
cat ${DOMAIN}-gost-certificate.crt ${DOMAIN}-gost-key.pem > ${DOMAIN}-gost-bundle.pem

echo "4. Certificados generados:"
echo "   - Clave privada: ${DOMAIN}-gost-key.pem"
echo "   - CSR: ${DOMAIN}-gost-request.csr"
echo "   - Certificado: ${DOMAIN}-gost-certificate.crt"
echo "   - Bundle: ${DOMAIN}-gost-bundle.pem"

# Verificar certificado
echo "5. Verificando certificado..."
openssl x509 -in ${DOMAIN}-gost-certificate.crt -text -noout -engine gost