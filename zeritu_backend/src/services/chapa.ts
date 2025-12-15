import axios from 'axios';

interface ChapaPaymentRequest {
  amount: number;
  currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  tx_ref: string;
  callback_url: string;
  return_url: string;
}

interface ChapaPaymentResponse {
  message: string;
  status: string;
  data: {
    checkout_url: string;
    tx_ref: string;
  };
}

export const createChapaPayment = async (
  paymentData: ChapaPaymentRequest
): Promise<{ checkout_url: string; tx_ref: string }> => {
  const secretKey = process.env.CHAPA_SECRET_KEY;

  if (!secretKey) {
    throw new Error('Chapa secret key is not configured');
  }

  try {
    const response = await axios.post<ChapaPaymentResponse>(
      'https://api.chapa.co/v1/transaction/initialize',
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.status === 'success') {
      return {
        checkout_url: response.data.data.checkout_url,
        tx_ref: response.data.data.tx_ref,
      };
    } else {
      throw new Error(response.data.message || 'Payment initialization failed');
    }
  } catch (error: any) {
    console.error('Chapa API error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to initialize payment');
  }
};

export const verifyChapaPayment = async (txRef: string): Promise<boolean> => {
  const secretKey = process.env.CHAPA_SECRET_KEY;

  if (!secretKey) {
    console.error('CHAPA_SECRET_KEY is not configured');
    throw new Error('Chapa secret key is not configured');
  }

  console.log(`Verifying Chapa payment for tx_ref: ${txRef}`);

  try {
    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    console.log('Chapa verification response:', JSON.stringify(response.data, null, 2));

    // According to Chapa docs at https://developer.chapa.co/
    // The API returns: { status: 'success', data: { status: 'success' | 'successful' | 'pending' | 'failed' } }
    const apiStatus = response.data?.status;
    const paymentStatus = response.data?.data?.status;
    
    console.log(`Chapa API status: ${apiStatus}, Payment status: ${paymentStatus}`);

    // Check both 'success' and 'successful' as Chapa uses both
    const isSuccess = apiStatus === 'success' && 
                      (paymentStatus === 'successful' || paymentStatus === 'success');
    
    console.log(`Payment verification result: ${isSuccess ? 'PAID' : 'NOT PAID'}`);
    
    return isSuccess;
  } catch (error: any) {
    console.error('Chapa verification error:', error.response?.data || error.message);
    console.error('Full error:', error);
    return false;
  }
};







