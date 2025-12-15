#!/bin/bash
# scripts/health-check.sh

# This script checks the health of the specified environment (blue or green).
# It polls the health check endpoint until it gets a successful response or times out.

set -e

ENVIRONMENT=$1
MAX_RETRIES=12
SLEEP_INTERVAL=5

if [ -z "$ENVIRONMENT" ]; then
  echo "❌ Error: Environment (blue or green) not specified."
  exit 1
fi

if [ "$ENVIRONMENT" == "green" ]; then
  URL="${GREEN_ENVIRONMENT_URL}/health" # GREEN_ENVIRONMENT_URL should be a secret/variable
elif [ "$ENVIRONMENT" == "blue" ]; then
  URL="${BLUE_ENVIRONMENT_URL}/health" # BLUE_ENVIRONMENT_URL should be a secret/variable
else
  echo "❌ Error: Invalid environment specified. Use 'blue' or 'green'."
  exit 1
fi

echo "🩺 Performing health check on $ENVIRONMENT environment at $URL..."

for ((i=1; i<=MAX_RETRIES; i++)); do
  echo "Attempt $i of $MAX_RETRIES..."
  # The 'curl' command checks the health endpoint.
  # --fail: Fails silently on server errors (returns non-zero exit code).
  # --silent, --output /dev/null: Suppresses normal output.
  if curl --silent --fail --output /dev/null "$URL"; then
    echo "✅ Health check successful. The $ENVIRONMENT environment is up and running."
    exit 0
  fi
  
  if [ $i -lt $MAX_RETRIES ]; then
    echo "Service not ready yet. Retrying in $SLEEP_INTERVAL seconds..."
    sleep $SLEEP_INTERVAL
  fi
done

echo "❌ Error: Health check failed for the $ENVIRONMENT environment after $MAX_RETRIES attempts."
exit 1
