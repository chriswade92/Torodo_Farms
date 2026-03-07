import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { login, clearError } from '../../store/slices/authSlice';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--accent-purple) 100%);
  padding: var(--spacing-md);
`;

const LoginCard = styled.div`
  background: var(--secondary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xxl);
  width: 100%;
  max-width: 400px;
  animation: slideUp 0.5s ease-out;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-xxl);
  
  h1 {
    color: var(--primary);
    font-size: 28px;
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-xs);
  }
  
  p {
    color: var(--sub-text);
    font-size: 14px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const FormGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  padding-left: 48px;
  border: 2px solid #E0E0E0;
  border-radius: var(--border-radius-md);
  font-size: 16px;
  transition: all var(--transition-fast);
  background: #FAFAFA;
  
  &:focus {
    border-color: var(--primary);
    background: var(--secondary);
    box-shadow: 0 0 0 3px rgba(100, 207, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--sub-text);
  }
`;

const Icon = styled.div`
  position: absolute;
  left: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  color: var(--sub-text);
  font-size: 18px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: var(--spacing-md);
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--sub-text);
  cursor: pointer;
  font-size: 18px;
  
  &:hover {
    color: var(--text);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: var(--spacing-md);
  background: var(--primary);
  color: var(--secondary);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 16px;
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  
  &:hover {
    background: #5BB8E0;
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  
  &:disabled {
    background: #E0E0E0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(255, 94, 126, 0.1);
  color: var(--accent-pink);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: 14px;
  text-align: center;
  border: 1px solid rgba(255, 94, 126, 0.2);
`;

const DemoInfo = styled.div`
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: rgba(100, 207, 246, 0.1);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(100, 207, 246, 0.2);
  
  h4 {
    color: var(--primary);
    font-size: 14px;
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    font-size: 12px;
    color: var(--sub-text);
    margin-bottom: var(--spacing-xs);
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>
          <h1>Torodo Farms</h1>
          <p>Admin Dashboard</p>
        </Logo>
        
        <Form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <FormGroup>
            <Icon>
              <FiMail />
            </Icon>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Icon>
              <FiLock />
            </Icon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </PasswordToggle>
          </FormGroup>
          
          <LoginButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </LoginButton>
        </Form>
        
        <DemoInfo>
          <h4>Demo Credentials</h4>
          <p><strong>Email:</strong> admin@torodofarms.com</p>
          <p><strong>Password:</strong> admin123</p>
        </DemoInfo>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login; 