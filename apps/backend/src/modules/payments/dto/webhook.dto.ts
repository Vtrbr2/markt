// O webhook recebe qualquer payload do gateway; validamos dentro do service
export class WebhookDto {
  // payload bruto
  [key: string]: any;
}
