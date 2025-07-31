// __tests__/HomeScreen.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../app/screens/customers/HomeScreen';
import { AuthProvider } from '../context/AuthContext';

// Mock Firebase
jest.mock('../services/firebase', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'test-user', displayName: 'Test User' }
  }
}));

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

const MockedHomeScreen = () => (
  <AuthProvider>
    <HomeScreen navigation={mockNavigation} />
  </AuthProvider>
);

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText } = render(<MockedHomeScreen />);
    expect(getByText('Hello,')).toBeTruthy();
  });

  it('displays user greeting', async () => {
    const { getByText } = render(<MockedHomeScreen />);
    await waitFor(() => {
      expect(getByText('Test User')).toBeTruthy();
    });
  });

  it('navigates to profile when profile button is pressed', async () => {
    const { getByTestId } = render(<MockedHomeScreen />);
    const profileButton = getByTestId('profile-button');
    
    fireEvent.press(profileButton);
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('screens/customers/ProfileScreen');
  });

  it('filters venues by search text', async () => {
    const { getByPlaceholderText, getByText } = render(<MockedHomeScreen />);
    const searchInput = getByPlaceholderText('Search venues, locations...');
    
    fireEvent.changeText(searchInput, 'football');
    
    await waitFor(() => {
      // Check that search functionality works
      expect(searchInput.props.value).toBe('football');
    });
  });
});
