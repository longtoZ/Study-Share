
```
StudyShare
├─ backend
│  ├─ flask
│  │  ├─ .dockerignore
│  │  ├─ app
│  │  │  ├─ config
│  │  │  │  ├─ celery.py
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
│  │  ├─ Dockerfile
│  │  ├─ instance
│  │  ├─ output_pdf
│  │  ├─ output_webp
│  │  ├─ requirements.txt
│  │  ├─ uploads
│  │  └─ wsgi.py
│  └─ node
│     ├─ .dockerignore
│     ├─ config
│     │  ├─ ai.config.js
│     │  ├─ database.config.js
│     │  ├─ jwt.config.js
│     │  ├─ passport.config.js
│     │  ├─ prometheus.config.js
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
│     │  ├─ task.controller.js
│     │  └─ user.controller.js
│     ├─ Dockerfile
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
│     │  ├─ task.model.js
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
│     │  ├─ task.route.js
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
│     ├─ tests
│     │  ├─ ai-chat.test.js
│     │  ├─ auth.test.js
│     │  ├─ comment.test.js
│     │  ├─ history.test.js
│     │  ├─ lesson.test.js
│     │  ├─ material.test.js
│     │  ├─ payment.test.js
│     │  ├─ rating.test.js
│     │  ├─ statistics.test.js
│     │  ├─ subject.test.js
│     │  ├─ task.test.js
│     │  └─ user.test.js
│     ├─ uploads
│     └─ utils
│        ├─ deleteUnverifiedAccount.js
│        ├─ sendEmail.js
│        ├─ validation.js
│        └─ verifyPasswordReset.js
├─ database
│  └─ schema.sql
├─ docker-compose.yaml
├─ frontend
│  ├─ .dockerignore
│  ├─ Dockerfile
│  ├─ entrypoint.sh
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ nginx.conf
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
│  │  │  │  └─ SearchBar.tsx
│  │  │  └─ layout
│  │  │     ├─ LessonsGrid.tsx
│  │  │     ├─ MaterialsGrid.tsx
│  │  │     ├─ SideBar.tsx
│  │  │     └─ TopBar.tsx
│  │  ├─ constants
│  │  │  ├─ endpoints.ts
│  │  │  └─ subjectColor.ts
│  │  ├─ interfaces
│  │  │  ├─ config.d.ts
│  │  │  ├─ table.d.ts
│  │  │  └─ userProfile.d.ts
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
│  │  │  │  │  ├─ CommentSection.tsx
│  │  │  │  │  ├─ ContentView.tsx
│  │  │  │  │  ├─ HeaderSection.tsx
│  │  │  │  │  ├─ MetadataCard.tsx
│  │  │  │  │  └─ RatingCard.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  ├─ useComments.ts
│  │  │  │  │  ├─ useMaterialContent.ts
│  │  │  │  │  └─ useMaterialData.ts
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
│  │  │  │  │  ├─ AccountStep.tsx
│  │  │  │  │  ├─ EmailVerification.tsx
│  │  │  │  │  ├─ PersonalInfoStep.tsx
│  │  │  │  │  └─ SignupHeader.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  └─ useSignup.ts
│  │  │  │  ├─ images
│  │  │  │  │  ├─ mail.png
│  │  │  │  │  └─ signup_background.jpeg
│  │  │  │  └─ SignupPage.tsx
│  │  │  ├─ StatisticsPage
│  │  │  │  ├─ components
│  │  │  │  │  ├─ GeneralStats.tsx
│  │  │  │  │  ├─ TopContributors.tsx
│  │  │  │  │  └─ TopMaterials.tsx
│  │  │  │  ├─ hooks
│  │  │  │  │  ├─ useGeneralStats.ts
│  │  │  │  │  ├─ useTopContributors.ts
│  │  │  │  │  └─ useTopMaterials.ts
│  │  │  │  └─ StatisticsPage.tsx
│  │  │  ├─ TasksPage
│  │  │  │  └─ TasksPage.tsx
│  │  │  ├─ UploadPage
│  │  │  │  ├─ components
│  │  │  │  │  └─ Upload.tsx
│  │  │  │  └─ UploadPage.tsx
│  │  │  └─ UserProfilePage
│  │  │     ├─ components
│  │  │     │  ├─ AboutSection.tsx
│  │  │     │  ├─ LessonsSection.tsx
│  │  │     │  ├─ MaterialsSection.tsx
│  │  │     │  └─ UserInfoSection.tsx
│  │  │     ├─ hooks
│  │  │     │  └─ useProfileData.ts
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
│  │  │  ├─ taskService.ts
│  │  │  └─ userService.ts
│  │  ├─ styles
│  │  │  └─ index.css
│  │  ├─ tests
│  │  │  ├─ AccountSettingPage
│  │  │  │  ├─ ConnectStripe.test.tsx
│  │  │  │  ├─ DeleteAccount.test.tsx
│  │  │  │  ├─ PersonalInfo.test.tsx
│  │  │  │  └─ ResetPassword.test.tsx
│  │  │  ├─ CreateLessonPage
│  │  │  │  └─ CreateLessonPage.test.tsx
│  │  │  ├─ HistoryPage
│  │  │  │  └─ HistoryPage.test.tsx
│  │  │  ├─ LessonEditPage
│  │  │  │  └─ LessonEditPage.test.tsx
│  │  │  ├─ LessonViewPage
│  │  │  │  └─ LessonViewPage.test.tsx
│  │  │  ├─ LoginPage
│  │  │  │  └─ LoginPage.test.tsx
│  │  │  ├─ MaterialEditPage.test
│  │  │  │  └─ MaterialEditPage.test.tsx
│  │  │  ├─ MaterialViewPage
│  │  │  │  ├─ AddLessonCard.test.tsx
│  │  │  │  ├─ ChatPannel.test.tsx
│  │  │  │  ├─ CommentSection.test.tsx
│  │  │  │  ├─ ContentView.test.tsx
│  │  │  │  ├─ HeaderSection.test.tsx
│  │  │  │  ├─ MetadataCard.test.tsx
│  │  │  │  └─ RatingCard.test.tsx
│  │  │  ├─ MyLessonsPage
│  │  │  │  └─ MyLessonsPage.test.tsx
│  │  │  ├─ OrdersPage
│  │  │  │  └─ OrdersPage.test.tsx
│  │  │  ├─ SearchPage
│  │  │  │  └─ SearchPage.test.tsx
│  │  │  ├─ setup.ts
│  │  │  ├─ SignupPage
│  │  │  │  ├─ AccountStep.test.tsx
│  │  │  │  ├─ EmailVerification.test.tsx
│  │  │  │  ├─ PersonalInfoStep.test.tsx
│  │  │  │  └─ SignupHeader.test.tsx
│  │  │  ├─ StatisticsPage
│  │  │  │  ├─ GeneralStats.test.tsx
│  │  │  │  ├─ TopContributors.test.tsx
│  │  │  │  └─ TopMaterials.test.tsx
│  │  │  ├─ UploadPage
│  │  │  │  └─ UploadPage.test.tsx
│  │  │  └─ UserProfilePage
│  │  │     ├─ AboutSection.test.tsx
│  │  │     ├─ LessonsSection.test.tsx
│  │  │     ├─ MaterialsSection.test.tsx
│  │  │     └─ UserInfoSection.test.tsx
│  │  ├─ utils
│  │  │  └─ storeMaterialsLessons.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.ts
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ vite.config.ts
│  └─ vitest.config.ts
├─ grafana
│  ├─ flask-monitoring-model.json
│  ├─ k8s-monitoring-model.json
│  └─ node-monitoring-model.json
├─ Jenkinsfile
├─ k8s
│  ├─ cluster
│  │  ├─ celery-worker-deployment.yaml
│  │  ├─ flask-backend-deployment.yaml
│  │  ├─ flask-backend-service.yaml
│  │  ├─ node-backend-deployment.yaml
│  │  ├─ node-backend-service.yaml
│  │  ├─ react-frontend-deployment.yaml
│  │  ├─ react-frontend-service.yaml
│  │  ├─ redis-deployment.yaml
│  │  └─ redis-service.yaml
│  ├─ ingress
│  │  └─ ingress.yaml
│  └─ prometheus
│     ├─ flask-service-monitor.yaml
│     ├─ node-service-monitor.yaml
│     └─ redis-service-monitor.yaml
├─ README.md
└─ wsl
   ├─ deploy-to-kubernetes.sh
   └─ deploy-to-minikube.sh

```