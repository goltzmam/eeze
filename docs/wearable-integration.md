# Minha eaze — investigação e limites

## Evidência examinada

Referência: https://github.com/LudovicoPiccolo/OpenH59, commit `95a879f70a023fe3e097e9a33010b9e4eddccec5`, checkout analisado em 28/10/2026. Arquivos: README.md, band.py e docs/APPUNTI-TECNICI.md. Nenhum arquivo LICENSE encontrado no checkout; não foi reutilizado código. Não assumir licença permissiva por estar no GitHub.

O projeto descreve H59 / Colmi / QWatch Pro (também QCWatch), não confirmação de LVW-51S/FitPro2. Usa Python/bleak/CoreBluetooth, PHP e MySQL; não é um SDK web oficial. Documenta um canal com pacotes de 16 bytes/checksum e outro canal com frames variáveis, CRC16, remontagem e login associado à conta do aplicativo. Algumas descrições de sono divergem em nível de certeza entre canais; exigem confrontação com hardware e dados do app oficial. Não há evidência examinada de API oficial do fabricante, SDK licenciado ou autorização para sincronização em nuvem.

Isso identifica hipóteses de investigação, não compatibilidade da eaze. Nenhum UUID ou comando proprietário da referência foi incorporado.

## O que o código atual faz

`ReadOnlyBluetoothAdapter` verifica navegador e contexto seguro; somente após clique abre `requestDevice`, com permissão do usuário, e tenta GATT. Solicita acesso opcional aos serviços SIG padronizados `device_information` e `battery_service`; lê apenas manufacturer_name_string, model_number_string, firmware_revision_string e battery_level quando disponíveis. Trata cancelamento, negação, falta de GATT e desconexão. Não escreve em características, altera firmware ou inicia medidas. Identidade e bateria exibidas somente quando lidas.

Serviços não concedidos pelo navegador não podem ser enumerados; o resultado não é inventário GATT completo. Identificadores de dispositivo do navegador não são prova de fabricante/propriedade.

Estado após conexão: `connected_unverified`, nunca sincronizado. `getCapabilities` retorna nenhuma métrica e protocolo não validado. `sync` falha explicitamente com PROTOCOL_UNVERIFIED. Não existe adapter de produção para coleta eaze, vinculação persistida ou pipeline de ingestão. Isso não é um laboratório no produto; é o estado honesto da conexão oficial ainda dependente de validação.

## Plataformas

| Plataforma                            | Identificação Web Bluetooth            | Sincronização eaze               |
| ------------------------------------- | -------------------------------------- | -------------------------------- |
| Chrome Android compatível, HTTPS      | Implementada, não testada fisicamente  | Bloqueada por protocolo/hardware |
| Chrome/Edge desktop compatível, HTTPS | Implementada, depende de suporte do SO | Bloqueada por protocolo/hardware |
| Safari iPhone / PWA instalada         | Sem Web Bluetooth nativo               | Sem integração externa validada  |
| Firefox e navegadores sem API         | Mensagem de incompatibilidade          | Indisponível                     |
| Navegadores especializados iOS        | Não validados                          | Não prometida                    |

Não foi construído aplicativo nativo nem ponte não autorizada.

## Dados necessários para continuar

Modelo físico/fabricante, firmware, nome Bluetooth, aplicativo e versão realmente usados, documentação/SDK e licença, acesso à pulseira e navegador compatível. Se a documentação for insuficiente, investigar capturas BLE autorizadas do próprio dispositivo e comparar os registros com o app oficial. Não enviar credenciais pessoais em logs ou no chat.

## Critério de conclusão

Identificar unidade → validar protocolo e autenticação → implementar parser independente com fixtures autorizadas → receber medições reais → conferir unidade/timestamp/semântica → persistir com consentimento e deduplicação → testar interrupção/retomada/sync parcial → exibir histórico verdadeiro → documentar matriz física de plataformas. Nenhuma dessas etapas deve ser substituída por uma conexão GATT bem-sucedida.
