#!/bin/bash
# Chercher le dossier moniteur1d-api
# D'abord essayer les chemins avec sous-dossier
for dir in /srv/moniteur1d-api/moniteur1d-api /root/moniteur1d-api/moniteur1d-api /opt/moniteur1d-api/moniteur1d-api; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo "$dir"
        exit 0
    fi
done

# Ensuite essayer les chemins simples
for dir in /root/moniteur1d-api ~/moniteur1d-api /opt/moniteur1d-api /var/www/moniteur1d-api /usr/local/moniteur1d-api /srv/moniteur1d-api; do
    if [ -d "$dir" ] && [ -f "$dir/package.json" ]; then
        echo "$dir"
        exit 0
    fi
done

# Si pas trouvé, chercher par package.json et prendre le plus spécifique
FOUND=$(find / -name "package.json" -path "*/moniteur1d-api/moniteur1d-api/*" 2>/dev/null | head -1)
if [ -n "$FOUND" ]; then
    dirname "$FOUND"
    exit 0
fi

FOUND=$(find / -name "package.json" -path "*/moniteur1d-api/*" 2>/dev/null | head -1)
if [ -n "$FOUND" ]; then
    dirname "$FOUND"
    exit 0
fi

# Dernier recours: chercher par .env
FOUND=$(find / -name ".env" -path "*/moniteur1d-api/moniteur1d-api/*" 2>/dev/null | head -1)
if [ -n "$FOUND" ]; then
    dirname "$FOUND"
    exit 0
fi

FOUND=$(find / -name ".env" -path "*/moniteur1d-api/*" 2>/dev/null | head -1)
if [ -n "$FOUND" ]; then
    dirname "$FOUND"
    exit 0
fi

exit 1

