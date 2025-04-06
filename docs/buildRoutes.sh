#!/bin/bash

to_json_array() {
  local dir="$1"
  local output="$2"

  # Используем mapfile для чтения списка файлов
  mapfile -t files < <(find "$dir" -type f)

  # Преобразуем массив в JSON с помощью jq
  echo "$(echo ${files[@]} | jq -Rsc 'split(" ")')" > "$output"
}

# Вызываем функцию с аргументами: директорией и именем выходного файла
to_json_array "pages" "routes.json"
