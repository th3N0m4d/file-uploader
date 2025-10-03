# File Uploader

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![AWS Lambda](https://img.shields.io/badge/AWS_Lambda-FF9900?style=for-the-badge&logo=awslambda&logoColor=white)](https://aws.amazon.com/lambda/)
[![AWS API Gateway](https://img.shields.io/badge/AWS_API_Gateway-FF9900?style=for-the-badge&logo=amazonapigateway&logoColor=white)](https://aws.amazon.com/api-gateway/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/github/workflow/status/th3N0m4d/file-uploader/CI?style=for-the-badge)](https://github.com/th3N0m4d/file-uploader/actions)
[![Version](https://img.shields.io/github/package-json/v/th3N0m4d/file-uploader?style=for-the-badge)](https://github.com/th3N0m4d/file-uploader)

A React-based file uploader component with drag-and-drop functionality, progress tracking, and multiple file support.

## Features

- ✅ Drag and drop file upload
- ✅ Multiple file support
- ✅ Real-time progress tracking
- ✅ File removal functionality
- ✅ File type restrictions

## Architecture

![Component Architecture](./docs/diagrams/Serverless%20File%20Uploader.drawio.png)

_View detailed architectural documentation in [/docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)_

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS3
- FontAwesome

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/th3N0m4d/file-uploader.git
cd file-uploader
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Documentation

- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Component Flow Diagram](./docs/diagrams/component-flow.png)
- [State Management](./docs/STATE_MANAGEMENT.md)
- [API Documentation](./docs/API.md)

## File Types Supported

- PDF (.pdf)
- Word Documents (.doc, .docx)
- Text Files (.txt)
- Images (.jpg, .png)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Open a Pull Request

## License

MIT License
