import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: 600,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  profileImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  editIcon: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  progress: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  warningContainer: {
    marginVertical: 15,
    padding: 15,
    backgroundColor: '#ffeeba',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffd57a',
    alignItems: 'center',
  },
  warningText: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    width: '100%',
  },
  disabledInput: {
    backgroundColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dropdownButton: {
    flex: 1,
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  dropdownSelected: {
    backgroundColor: '#d1d1d1',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  verifyButton: {
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  verifyButtonActive: {
    backgroundColor: '#28a745',
  },
  verifyButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center', 
  },
  dobContainer: {
    marginBottom: 15,
  },
});

  