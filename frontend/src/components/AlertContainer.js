import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'


export default function AlertContainer({alerts, setAlerts}) {

  const closeAlert = (id) => {
    setAlerts(alerts.filter(item => item.id !== id));
  }

  return (
    <ToastContainer className="position-absolute mx-auto start-0 end-0">
      {alerts.map(alert => (
        <Toast key={alert.id} onClose={() => {closeAlert(alert.id)}}>
          <Toast.Header>
            <strong className="me-auto">{alert.title}</strong>
          </Toast.Header>
          <Toast.Body>{alert.message}</Toast.Body>
        </Toast>
      ))}
    </ToastContainer>
  )
}