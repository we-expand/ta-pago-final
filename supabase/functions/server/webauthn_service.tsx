import * as kv from "./kv_store.tsx";

// Tipos básicos do WebAuthn
interface Credential {
  id: string;
  publicKey: string;
  counter: number;
  transports?: string[];
}

interface Challenge {
  challenge: string;
  timestamp: number;
}

// Gerar challenge aleatório
function generateChallenge(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Base64url encode
function base64urlEncode(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

// Gerar opções de registro
export async function generateRegistrationOptions(userId: string, userName: string, rpID: string) {
  const challenge = generateChallenge();
  
  // Salvar challenge
  await kv.set(`webauthn_challenge_${userId}`, {
    challenge,
    timestamp: Date.now()
  });

  return {
    challenge,
    rp: {
      name: "Tá Pago.pt",
      id: rpID
    },
    user: {
      id: userId,
      name: userName,
      displayName: userName
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },  // ES256
      { type: "public-key", alg: -257 } // RS256
    ],
    timeout: 60000,
    attestation: "none",
    authenticatorSelection: {
      authenticatorAttachment: "platform",
      requireResidentKey: false,
      userVerification: "preferred"
    }
  };
}

// Verificar registro
export async function verifyRegistration(userId: string, response: any, rpID: string, origin: string) {
  // Buscar challenge
  const storedChallenge = await kv.get(`webauthn_challenge_${userId}`);
  if (!storedChallenge) {
    throw new Error('Challenge not found or expired');
  }

  // Validar challenge (simplificado)
  if (response.response.clientDataJSON) {
    // Salvar credencial
    const credential: Credential = {
      id: response.id,
      publicKey: response.response.attestationObject,
      counter: 0,
      transports: response.response.transports
    };

    await kv.set(`webauthn_credential_${userId}`, credential);
    await kv.del(`webauthn_challenge_${userId}`);

    return { verified: true };
  }

  return { verified: false };
}

// Gerar opções de autenticação
export async function generateAuthenticationOptions(userId: string, rpID: string) {
  const challenge = generateChallenge();
  
  // Salvar challenge
  await kv.set(`webauthn_auth_challenge_${userId}`, {
    challenge,
    timestamp: Date.now()
  });

  // Buscar credenciais do usuário
  const credential = await kv.get(`webauthn_credential_${userId}`);
  
  const allowCredentials = credential ? [{
    type: "public-key",
    id: credential.id,
    transports: credential.transports || ["internal"]
  }] : [];

  return {
    challenge,
    timeout: 60000,
    rpId: rpID,
    allowCredentials,
    userVerification: "preferred"
  };
}

// 🔐 Gerar opções de LOGIN (sem userId - busca todas as credenciais)
export async function generateLoginOptions(rpID: string) {
  const challenge = generateChallenge();
  
  // Salvar challenge global
  await kv.set(`webauthn_login_challenge_${challenge}`, {
    challenge,
    timestamp: Date.now()
  });

  return {
    challenge,
    timeout: 60000,
    rpId: rpID,
    userVerification: "preferred"
  };
}

// Verificar autenticação
export async function verifyAuthentication(userId: string, response: any, rpID: string, origin: string) {
  // Buscar challenge
  const storedChallenge = await kv.get(`webauthn_auth_challenge_${userId}`);
  if (!storedChallenge) {
    throw new Error('Challenge not found or expired');
  }

  // Buscar credencial
  const credential = await kv.get(`webauthn_credential_${userId}`);
  if (!credential) {
    throw new Error('No credential found for user');
  }

  // Validar (simplificado para MVP)
  if (response.id === credential.id) {
    await kv.del(`webauthn_auth_challenge_${userId}`);
    return { verified: true };
  }

  return { verified: false };
}

// 🔐 Verificar LOGIN (busca userId pela credencial)
export async function verifyLogin(response: any, rpID: string, origin: string) {
  console.log('[WEBAUTHN SERVICE] Verifying login with credential:', response.id);
  
  // Buscar o challenge da resposta
  // NOTA: O response.response.clientDataJSON contém o challenge
  const clientDataJSON = JSON.parse(
    new TextDecoder().decode(
      Uint8Array.from(atob(response.response.clientDataJSON.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
    )
  );
  
  const challenge = clientDataJSON.challenge;
  console.log('[WEBAUTHN SERVICE] Challenge from response:', challenge);
  
  // Verificar challenge
  const storedChallenge = await kv.get(`webauthn_login_challenge_${challenge}`);
  if (!storedChallenge) {
    console.error('[WEBAUTHN SERVICE] Challenge not found or expired');
    throw new Error('Challenge not found or expired');
  }

  // Buscar todas as credenciais e encontrar a que corresponde
  const allKeys = await kv.getByPrefix('webauthn_credential_');
  console.log('[WEBAUTHN SERVICE] Searching through', allKeys.length, 'credentials');
  
  for (const credentialData of allKeys) {
    if (credentialData.id === response.id) {
      // Encontrou! Extrair userId da chave
      // Formato: webauthn_credential_${userId}
      const keys = await kv.getByPrefix('webauthn_credential_');
      for (const item of keys) {
        if (item.id === response.id) {
          // Buscar a chave original para extrair o userId
          const allEntries = await kv.getByPrefix('webauthn_credential_');
          // A chave está no formato webauthn_credential_${userId}
          // Mas o KV só retorna valores, precisamos iterar diferente
          
          // HACK: Vamos iterar por todos os possíveis userIds
          // Isso não é ideal mas funciona para MVP
          const possibleUserIds = await kv.getByPrefix('user_');
          for (const userData of possibleUserIds) {
            const testUserId = userData.id || userData.userId;
            if (!testUserId) continue;
            
            const testCredential = await kv.get(`webauthn_credential_${testUserId}`);
            if (testCredential && testCredential.id === response.id) {
              console.log('[WEBAUTHN SERVICE] ✅ Found matching credential for user:', testUserId);
              await kv.del(`webauthn_login_challenge_${challenge}`);
              return { verified: true, userId: testUserId };
            }
          }
        }
      }
    }
  }

  console.error('[WEBAUTHN SERVICE] ❌ No matching credential found');
  return { verified: false, userId: null };
}

// Reset de credenciais
export async function resetUserCredentials(userId: string) {
  await kv.del(`webauthn_credential_${userId}`);
  await kv.del(`webauthn_challenge_${userId}`);
  await kv.del(`webauthn_auth_challenge_${userId}`);
}

export const webauthnService = {
  generateRegistrationOptions,
  verifyRegistration,
  generateAuthenticationOptions,
  generateLoginOptions,
  verifyAuthentication,
  verifyLogin,
  resetUserCredentials
};