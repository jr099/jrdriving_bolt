import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import type { CreateQuoteDto } from '@jrdriving/shared';
import { QuotesService } from './quotes.service';

const quoteSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(4),
  companyName: z.string().optional(),
  vehicleType: z.string().min(1),
  departureLocation: z.string().min(1),
  arrivalLocation: z.string().min(1),
  preferredDate: z.string().optional(),
  message: z.string().optional(),
});

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotes: QuotesService) {}

  @Post()
  async create(@Body() body: unknown) {
    const payload = quoteSchema.parse(body) as CreateQuoteDto;
    await this.quotes.createQuote(payload);
    return { message: 'Demande de devis enregistrée.' };
  }
}
