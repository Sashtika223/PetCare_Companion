import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { PetsList } from './pages/PetsList';
import { PetForm } from './pages/PetForm';
import { PetProfile } from './pages/PetProfile';
import { VaccinationsList } from './pages/VaccinationsList';
import { VaccinationForm } from './pages/VaccinationForm';
import { MedicationsList } from './pages/MedicationsList';
import { MedicationForm } from './pages/MedicationForm';
import { AppointmentsList } from './pages/AppointmentsList';
import { AppointmentForm } from './pages/AppointmentForm';
import { ActivitiesList } from './pages/ActivitiesList';
import { ActivityForm } from './pages/ActivityForm';
import { CareTipsList } from './pages/CareTipsList';
import { CareTipDetail } from './pages/CareTipDetail';
import { NotificationsPage } from './pages/NotificationsPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Main Layout Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Pet Management Routes */}
              <Route path="/pets" element={<PetsList />} />
              <Route path="/pets/new" element={<PetForm />} />
              <Route path="/pets/:petId" element={<PetProfile />} />
              <Route path="/pets/:petId/edit" element={<PetForm />} />

              {/* Vaccination Routes */}
              <Route path="/pets/:petId/vaccinations" element={<VaccinationsList />} />
              <Route path="/pets/:petId/vaccinations/new" element={<VaccinationForm />} />

              {/* Medication Routes */}
              <Route path="/pets/:petId/medications" element={<MedicationsList />} />
              <Route path="/pets/:petId/medications/new" element={<MedicationForm />} />

              {/* Appointment Routes */}
              <Route path="/appointments" element={<AppointmentsList />} />
              <Route path="/appointments/new" element={<AppointmentForm />} />

              {/* Activity Routes */}
              <Route path="/pets/:petId/activities" element={<ActivitiesList />} />
              <Route path="/pets/:petId/activities/new" element={<ActivityForm />} />

              {/* Care Tips Routes */}
              <Route path="/care-tips" element={<CareTipsList />} />
              <Route path="/care-tips/:tipId" element={<CareTipDetail />} />

              {/* Notification Routes */}
              <Route path="/notifications" element={<NotificationsPage />} />
            </Route>
          </Route>

          {/* Default Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
