import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingTop: 45,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  visualizationContainer: {
    alignItems: 'center',
  },
  navBarVisualization: {
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
  },
  visualizationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  visualizationLabel: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
  },
  navigationInfo: {
    alignItems: 'center',
  },
  navigationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    marginBottom: 20,
  },
  navigationIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  navigationTypeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  detailsGrid: {
    width: '100%',
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  detailLabel: {
    fontSize: 18,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '600',
  },
  quickTestsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickTestItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickTestLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickTestValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  actionContainerTopPaddingView: {
    flex: 1,
  },
  actionsContainer: {
    marginTop: 0,
  },
  actionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#3498db',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#34495e',
    fontSize: 18,
    fontWeight: '500',
  },
});
