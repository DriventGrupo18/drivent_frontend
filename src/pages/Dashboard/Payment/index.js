import { useEffect, useState } from 'react';
import { Description, StyledContainer, Title, OptionsContainer, OptionCard, ReserveButton, UnRegisted } from '../../../components/Payment';
import useToken from '../../../hooks/useToken';
import { reserveTicket } from '../../../services/paymentApi';
import { getPersonalInformations } from '../../../services/enrollmentApi';
import Card from '../../../components/Payment/Card';

export default function Payment() {
  const token = useToken();

  const [selectedModality, setSelectedModality] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [price, setPrice] = useState(null);
  const [registered, setRegisterd] = useState(false);
  const [payment, setPayment] = useState(false);
  const [ticketNow, setTicketNow] = useState();

  useEffect(async() => {
    try {
      const enrolment = await getPersonalInformations(token);
      if (enrolment) setRegisterd(true);
    } catch {
      setRegisterd(false);
    }
  });

  function selectTicketType() {
    if (selectedModality === 'Online') return 1;
    if (selectedModality === 'Presencial') {
      if (selectedHotel === 'Sem Hotel') return 2;
      return 3;
    }
  }

  function sendTicket() {
    const ticketTypeId = selectTicketType();
    setTicketNow(reserveTicket(token, ticketTypeId));
    setPayment(true);
  }

  function modality(m) {
    setSelectedModality((prevModality) => (prevModality === m ? null : m));
    setSelectedHotel(null);
  }

  function hotel(h) {
    setSelectedHotel((prevHotel) => (prevHotel === h ? null : h));
  }

  return (
    <>
      <StyledContainer>
        <Title>Ingresso e pagamento</Title>
        {registered && (
          <>
            {!payment && (
              <>
                <Description>Primeiro, escolha sua modalidade de ingresso</Description>
                <OptionsContainer>
                  <OptionCard
                    onClick={() => {modality('Presencial'); setPrice('100,00');}}
                    style={{ backgroundColor: selectedModality === 'Presencial' ? '#FFEED2' : '' }}>
                    <div>Presencial<h2>R$ 250,00</h2></div>
                  </OptionCard>

                  <OptionCard
                    onClick={() => {modality('Online'); setPrice('100,00');}}
                    style={{ backgroundColor: selectedModality === 'Online' ? '#FFEED2' : '' }}>
                    <div>Online<h2>R$ 100,00</h2></div>
                  </OptionCard>
                </OptionsContainer>

                {selectedModality === 'Presencial' && (
                  <>
                    <Description>Ótimo! Agora escolha sua modalidade de hospedagem</Description>
                    <OptionsContainer>
                      <OptionCard
                        onClick={() => {hotel('Sem Hotel'); setPrice('250,00');}}
                        style={{ backgroundColor: selectedHotel === 'Sem Hotel' ? '#FFEED2' : '' }}>
                        <div>Sem Hotel<h2>+ R$ 0,00</h2></div>
                      </OptionCard>

                      <OptionCard
                        onClick={() => {hotel('Com Hotel'); setPrice('600,00');}}
                        style={{ backgroundColor: selectedHotel === 'Com Hotel' ? '#FFEED2' : '' }}>
                        <div>Com hotel<h2>+R$ 350,00</h2></div>
                      </OptionCard>
                    </OptionsContainer>
                  </>
                )}
                {(selectedModality === 'Online' || selectedHotel !== null) && (
                  <>
                    <Description>Fechado! O total ficou em <span>R${price}</span>. Agora é só confirmar:</Description>
                    <ReserveButton
                      onClick={sendTicket}>
                      RESERVAR INGRESSO
                    </ReserveButton>
                  </>
                )}
              </>
            )}
            {payment && (<Card ticket={ticketNow} token={token} price={price} 
              modality={selectedModality} hotel={selectedHotel}/>
            )}
          </>
        )}
        {!registered && (
          <>
            <UnRegisted>
            Você precisa completar sua inscrição antes de prosseguir pra escolha de ingresso
            </UnRegisted>
          </>
        )}
      </StyledContainer>
    </>
  );
}
