import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiBarChart2, 
  FiMenu, 
  FiX,
  FiLogOut,
  FiUser
} from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: var(--background);
`;

const Sidebar = styled.div`
  width: 280px;
  background: var(--secondary);
  box-shadow: var(--shadow-sm);
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 1000;
  transition: transform var(--transition-normal);
  
  @media (max-width: 768px) {
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div`
  padding: var(--spacing-xl);
  border-bottom: 1px solid #E0E0E0;
  
  h2 {
    color: var(--primary);
    font-size: 20px;
    font-weight: var(--font-weight-bold);
    margin: 0;
  }
  
  p {
    color: var(--sub-text);
    font-size: 12px;
    margin: var(--spacing-xs) 0 0 0;
  }
`;

const NavMenu = styled.nav`
  padding: var(--spacing-lg) 0;
`;

const NavItem = styled.div`
  margin: 0 var(--spacing-md);
  margin-bottom: var(--spacing-xs);
`;

const NavLink = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--secondary)' : 'var(--text)'};
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 14px;
  font-weight: ${props => props.active ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)'};
  cursor: pointer;
  transition: all var(--transition-fast);
  text-decoration: none;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'rgba(100, 207, 246, 0.1)'};
    color: ${props => props.active ? 'var(--secondary)' : 'var(--primary)'};
  }
  
  svg {
    font-size: 18px;
  }
`;

const UserSection = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--spacing-lg);
  border-top: 1px solid #E0E0E0;
  background: var(--secondary);
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  .user-avatar {
    width: 40px;
    height: 40px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary);
    font-weight: var(--font-weight-semibold);
  }
  
  .user-details {
    flex: 1;
    
    h4 {
      font-size: 14px;
      font-weight: var(--font-weight-semibold);
      margin: 0;
      color: var(--text);
    }
    
    p {
      font-size: 12px;
      color: var(--sub-text);
      margin: 0;
    }
  }
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(255, 94, 126, 0.1);
  color: var(--accent-pink);
  border: 1px solid rgba(255, 94, 126, 0.2);
  border-radius: var(--border-radius-md);
  font-size: 14px;
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--accent-pink);
    color: var(--secondary);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 280px;
  transition: margin-left var(--transition-normal);
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Header = styled.header`
  background: var(--secondary);
  padding: var(--spacing-lg) var(--spacing-xl);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  color: var(--text);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: var(--font-weight-bold);
  color: var(--text);
  margin: 0;
`;

const Content = styled.div`
  padding: var(--spacing-xl);
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const navigationItems = [
  { path: '/dashboard', label: 'Dashboard', icon: FiHome },
  { path: '/products', label: 'Products', icon: FiPackage },
  { path: '/orders', label: 'Orders', icon: FiShoppingCart },
  { path: '/customers', label: 'Customers', icon: FiUsers },
  { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
];

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const navItem = navigationItems.find(item => item.path === currentPath);
    return navItem ? navItem.label : 'Dashboard';
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <LayoutContainer>
      <Overlay isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />
      
      <Sidebar isOpen={sidebarOpen}>
        <SidebarHeader>
          <h2>Torodo Farms</h2>
          <p>Admin Dashboard</p>
        </SidebarHeader>
        
        <NavMenu>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavItem key={item.path}>
                <NavLink
                  active={isActive}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon />
                  {item.label}
                </NavLink>
              </NavItem>
            );
          })}
        </NavMenu>
        
        <UserSection>
          <UserInfo>
            <div className="user-avatar">
              <FiUser />
            </div>
            <div className="user-details">
              <h4>{user?.name || 'Admin User'}</h4>
              <p>{user?.email || 'admin@torodofarms.com'}</p>
            </div>
          </UserInfo>
          
          <LogoutButton onClick={handleLogout}>
            <FiLogOut />
            Logout
          </LogoutButton>
        </UserSection>
      </Sidebar>
      
      <MainContent>
        <Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
            <MobileMenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </MobileMenuButton>
            <PageTitle>{getPageTitle()}</PageTitle>
          </div>
        </Header>
        
        <Content>
          <Outlet />
        </Content>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout; 