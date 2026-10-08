import { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PageFallback } from '@/components/PageFallback'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ShopLayout } from '@/components/layouts/ShopLayout'
import { lazyPage } from '@/lib/lazy-page'

const AdminLayout = lazyPage(
  () => import('@/components/layouts/AdminLayout'),
  'AdminLayout',
)
const LoginPage = lazyPage(() => import('@/pages/auth/LoginPage'), 'LoginPage')
const RegisterPage = lazyPage(
  () => import('@/pages/auth/RegisterPage'),
  'RegisterPage',
)

const CatalogPage = lazyPage(
  () => import('@/pages/shop/CatalogPage'),
  'CatalogPage',
)
const CartPage = lazyPage(() => import('@/pages/shop/CartPage'), 'CartPage')
const CheckoutPage = lazyPage(
  () => import('@/pages/shop/CheckoutPage'),
  'CheckoutPage',
)
const ShopOrdersPage = lazyPage(
  () => import('@/pages/shop/ShopOrdersPage'),
  'ShopOrdersPage',
)
const ShopProfilePage = lazyPage(
  () => import('@/pages/shop/ShopProfilePage'),
  'ShopProfilePage',
)
const NewsPage = lazyPage(() => import('@/pages/shop/NewsPage'), 'NewsPage')
const NewsItemPage = lazyPage(
  () => import('@/pages/shop/NewsItemPage'),
  'NewsItemPage',
)

const DashboardPage = lazyPage(
  () => import('@/pages/admin/DashboardPage'),
  'DashboardPage',
)
const AdminProductsPage = lazyPage(
  () => import('@/pages/admin/AdminProductsPage'),
  'AdminProductsPage',
)
const ProductFormPage = lazyPage(
  () => import('@/pages/admin/ProductFormPage'),
  'ProductFormPage',
)
const CategoriesPage = lazyPage(
  () => import('@/pages/admin/CategoriesPage'),
  'CategoriesPage',
)
const ManufacturersPage = lazyPage(
  () => import('@/pages/admin/ManufacturersPage'),
  'ManufacturersPage',
)
const AdminOrdersPage = lazyPage(
  () => import('@/pages/admin/AdminOrdersPage'),
  'AdminOrdersPage',
)
const UsersPage = lazyPage(() => import('@/pages/admin/UsersPage'), 'UsersPage')
const AdminNewsPage = lazyPage(
  () => import('@/pages/admin/AdminNewsPage'),
  'AdminNewsPage',
)
const AdminProfilePage = lazyPage(
  () => import('@/pages/admin/AdminProfilePage'),
  'AdminProfilePage',
)

export function App() {
  return (
    <Suspense fallback={<PageFallback fullScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute roles={['CUSTOMER']}>
              <ShopLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CatalogPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<ShopOrdersPage />} />
          <Route path="profile" element={<ShopProfilePage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:id" element={<NewsItemPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['ADMIN', 'SUPPLIER']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<ProductFormPage />} />
          <Route path="products/:id" element={<ProductFormPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route
            path="categories"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="manufacturers"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <ManufacturersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <UsersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="news"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminNewsPage />
              </ProtectedRoute>
            }
          />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
