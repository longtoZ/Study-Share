
```
StudyShare
├─ backend
│  ├─ flask
│  │  ├─ app
│  │  │  ├─ config
│  │  │  │  ├─ celery_worker.py
│  │  │  │  └─ supabase_client.py
│  │  │  ├─ constants
│  │  │  │  └─ table.py
│  │  │  ├─ models
│  │  │  │  └─ material.py
│  │  │  ├─ routes.py
│  │  │  ├─ services
│  │  │  │  ├─ celery_tasks.py
│  │  │  │  ├─ file_content_extractor.py
│  │  │  │  └─ file_converter.py
│  │  │  └─ __init__.py
│  │  ├─ instance
│  │  ├─ output_pdf
│  │  ├─ output_webp
│  │  ├─ run.py
│  │  └─ uploads
│  └─ node
│     ├─ config
│     │  ├─ ai.config.js
│     │  ├─ database.config.js
│     │  ├─ jwt.config.js
│     │  ├─ passport.config.js
│     │  ├─ redis.config.js
│     │  └─ stripe.config.js
│     ├─ constants
│     │  └─ constant.js
│     ├─ controllers
│     │  ├─ ai-chat.controller.js
│     │  ├─ auth.controller.js
│     │  ├─ comment.controller.js
│     │  ├─ history.controller.js
│     │  ├─ lesson.controller.js
│     │  ├─ material.controller.js
│     │  ├─ payment.controller.js
│     │  ├─ rating.controller.js
│     │  ├─ statistics.controller.js
│     │  ├─ subject.controller.js
│     │  └─ user.controller.js
│     ├─ middleware
│     │  └─ auth.middleware.js
│     ├─ models
│     │  ├─ comment.model.js
│     │  ├─ history.model.js
│     │  ├─ lesson.model.js
│     │  ├─ material-summary.model.js
│     │  ├─ material.model.js
│     │  ├─ payment.model.js
│     │  ├─ rating.model.js
│     │  ├─ statistics.model.js
│     │  ├─ subject.model.js
│     │  └─ user.model.js
│     ├─ package-lock.json
│     ├─ package.json
│     ├─ routes
│     │  ├─ ai-chat.route.js
│     │  ├─ auth.route.js
│     │  ├─ comment.route.js
│     │  ├─ google-oauth.route.js
│     │  ├─ history.route.js
│     │  ├─ lesson.route.js
│     │  ├─ material.route.js
│     │  ├─ payment.route.js
│     │  ├─ rating.route.js
│     │  ├─ statistics.route.js
│     │  ├─ subject.route.js
│     │  └─ user.route.js
│     ├─ server.js
│     ├─ services
│     │  ├─ ai-chat.service.js
│     │  ├─ history.service.js
│     │  ├─ lesson.service.js
│     │  ├─ material.service.js
│     │  ├─ payment.service.js
│     │  ├─ rating.service.js
│     │  ├─ statistics.service.js
│     │  ├─ subject.service.js
│     │  └─ user.service.js
│     ├─ temp
│     │  └─ files
│     ├─ uploads
│     └─ utils
│        ├─ deleteUnverifiedAccount.js
│        ├─ pdf.util.js
│        ├─ sendEmail.js
│        ├─ validation.js
│        └─ verifyPasswordReset.js
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  ├─ images
│  │  │  │  ├─ background.jpg
│  │  │  │  └─ profile.png
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  ├─ common
│  │  │  │  ├─ DropdownList.tsx
│  │  │  │  ├─ DropdownListRetrieve.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  └─ layout
│  │  │     ├─ LessonsGrid.tsx
│  │  │     ├─ MaterialsGrid.tsx
│  │  │     ├─ SideBar.tsx
│  │  │     └─ TopBar.tsx
│  │  ├─ constants
│  │  │  └─ subjectColor.ts
│  │  ├─ interfaces
│  │  │  ├─ table.ts
│  │  │  └─ userProfile.ts
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ AccountSettingPage
│  │  │  │  ├─ AccountSettingPage.tsx
│  │  │  │  ├─ components
│  │  │  │  │  └─ ImageUpload.tsx
│  │  │  │  ├─ images
│  │  │  │  │  └─ stripe_logo.png
│  │  │  │  └─ layouts
│  │  │  │     ├─ ConnectStripe.tsx
│  │  │  │     ├─ DeleteAccount.tsx
│  │  │  │     ├─ PersonalInfo.tsx
│  │  │  │     └─ ResetPassword.tsx
│  │  │  ├─ CreateLessonPage
│  │  │  │  └─ CreateLessonPage.tsx
│  │  │  ├─ HistoryPage
│  │  │  │  └─ HistoryPage.tsx
│  │  │  ├─ LessonEditPage
│  │  │  │  └─ LessonEditPage.tsx
│  │  │  ├─ LessonViewPage
│  │  │  │  └─ LessonViewPage.tsx
│  │  │  ├─ LoginPage
│  │  │  │  ├─ components
│  │  │  │  │  ├─ Login.tsx
│  │  │  │  │  └─ ResetPassword.tsx
│  │  │  │  ├─ images
│  │  │  │  │  └─ login_background.jpeg
│  │  │  │  └─ LoginPage.tsx
│  │  │  ├─ MaterialEditPage
│  │  │  │  └─ MaterialEditPage.tsx
│  │  │  ├─ MaterialViewPage
│  │  │  │  ├─ components
│  │  │  │  │  ├─ AddLessonCard.tsx
│  │  │  │  │  ├─ ChatPannel.tsx
│  │  │  │  │  ├─ MetadataCard.tsx
│  │  │  │  │  └─ RatingCard.tsx
│  │  │  │  ├─ images
│  │  │  │  │  ├─ chatgpt-icon.png
│  │  │  │  │  └─ google-gemini-icon.png
│  │  │  │  └─ MaterialViewPage.tsx
│  │  │  ├─ MyLessonsPage
│  │  │  │  └─ MyLessonsPage.tsx
│  │  │  ├─ MyMaterialsPage
│  │  │  │  └─ MyMaterialsPage.tsx
│  │  │  ├─ OrdersPage
│  │  │  │  └─ OrdersPage.tsx
│  │  │  ├─ PaymentHistoryPage
│  │  │  │  └─ PaymentHistoryPage.tsx
│  │  │  ├─ RedirectPage
│  │  │  │  ├─ RedirectToHomePage.tsx
│  │  │  │  └─ RootRedirectPage.tsx
│  │  │  ├─ SearchPage
│  │  │  │  └─ SearchPage.tsx
│  │  │  ├─ SignupPage
│  │  │  │  ├─ components
│  │  │  │  │  └─ EmailVerification.tsx
│  │  │  │  ├─ images
│  │  │  │  │  ├─ mail.png
│  │  │  │  │  └─ signup_background.jpeg
│  │  │  │  └─ SignupPage.tsx
│  │  │  ├─ StatisticsPage
│  │  │  │  └─ StatisticsPage.tsx
│  │  │  ├─ UploadPage
│  │  │  │  ├─ components
│  │  │  │  │  └─ Upload.tsx
│  │  │  │  └─ UploadPage.tsx
│  │  │  └─ UserProfilePage
│  │  │     ├─ images
│  │  │     │  ├─ placeholder_bg.png
│  │  │     │  └─ placeholder_pfp.png
│  │  │     └─ UserProfilePage.tsx
│  │  ├─ redux
│  │  │  ├─ materialSlice.ts
│  │  │  ├─ store.ts
│  │  │  └─ userSlice.ts
│  │  ├─ services
│  │  │  ├─ aiChatService.ts
│  │  │  ├─ authService.ts
│  │  │  ├─ commentService.ts
│  │  │  ├─ historyService.ts
│  │  │  ├─ lessonService.ts
│  │  │  ├─ materialService.ts
│  │  │  ├─ paymentService.ts
│  │  │  ├─ ratingService.ts
│  │  │  ├─ statisticsService.ts
│  │  │  ├─ subjectService.ts
│  │  │  └─ userService.ts
│  │  ├─ styles
│  │  │  └─ index.css
│  │  ├─ utils
│  │  │  └─ storeMaterialsLessons.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  └─ vite.config.ts
└─ README.md

```