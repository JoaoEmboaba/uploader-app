## Uploader App

## Instruções para executar o app

Antes do app começar a ser distribuído, para executa-lo de forma correta, execute os seguintes comandos:

- `npm run build` (Gera a pasta dist com os fontes necessários para visualização e funcionamento do app)
- `npm run package --arch="i32, x64"` (Gera a pasta out com os arquivos gerados para executar o app no desktop para arquiteturas windows i32 e 64 bits)

### Para "rodar o app"
Dentro da pasta out, encontre o arquivo uploader-ng-app.exe no diretório `/uploader-app/out/uploader-ng-app-win32-x64/uploader-ng-app.exe`

### Importante
`Tipos de arquivos permitidos`:
- .pdf
- .png
- .jpeg

`MimeTypes` Não permitidos:
- .exe
- .ddl
- .bat
- .cmd
- .sh
- .cgi
- .jar
