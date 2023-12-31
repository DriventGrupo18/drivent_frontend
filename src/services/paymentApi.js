import { toast } from 'react-toastify';
import api from './api';

export async function getTicketTypes(token) {
  const response = await api.get('/tickets/types', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}   

export async function reserveTicket(token, ticketTypeId) {
  try { 
    const result = await api.post('/tickets', { ticketTypeId }, { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    toast('Ingresso reservado com sucesso!');
    return result.data;
  } catch (error) {
    toast('Erro ao fazer a reserva do ingresso');
  }
}

export async function paymentTicket(body, token) {
  try {
    await api.post('/payments/process', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    toast('Ingresso pago com sucesso!');
  } catch (error) {
    toast('Erro ao fazer a reserva do ingresso');
    console.log(error.response.config.data);
  }
};
