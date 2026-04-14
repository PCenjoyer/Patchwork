import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { TemplateGalleryPage } from './pages/TemplateGalleryPage';
import { DocumentListPage } from './pages/DocumentListPage';
import { BuilderPage } from './pages/BuilderPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<TemplateGalleryPage />} />
        <Route path="documents" element={<DocumentListPage />} />
      </Route>
      <Route path="builder/new/:templateId" element={<BuilderPage />} />
      <Route path="builder/:documentId" element={<BuilderPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
