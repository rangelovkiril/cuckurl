
## 1. Структура
src/
├── database/
│   ├── entities/
│   │   ├── user.entity.ts
│   │   └── short-url.entity.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   └── short-url.repository.ts
│   ├── database.module.ts
└── app.module.ts

## 2. .env файл
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=url_shortener
```

## 3. Включване на TypeORM
Във файла `database.module.ts`:
- Включване на TypeORM
- Импорт и експорт на `TypeOrmModule`

## 4. Необходими за реализация операции
### ShortUrl:
- createShortUrl
- linkUrlToUser
- findByShortCode
- findAllByUser
- incrementVisitCount
> Аргументите на функциите зависят от конкретните реализации

### User:
- createUser(...)
- findUserById(...)

## 5. Къде какво има и за какво служи
- Repository - фактически самия TypeORM, интерфейса за бакенда
- Entity - фактически таблици, които отговарят на схемите на БД

## 6. Какво да правиш с AppModule
- Махни app.controller.ts и app.service.ts
- Импортирай само:
  - DatabaseModule
  - ShortUrlModule
  - UserModule

## 7. Прочее
- Пуска се със `npx nest start --watch`, който можеш да напишеш срещу `start:dev` в package.json и да пускаш през `npm run start:dev`
