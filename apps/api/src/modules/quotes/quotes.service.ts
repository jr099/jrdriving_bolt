import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { schema } from '../../database/database.module';
import type { CreateQuoteDto } from '@jrdriving/shared';

@Injectable()
export class QuotesService {
  constructor(private readonly database: DatabaseService) {}

  async createQuote(payload: CreateQuoteDto) {
    const { db } = this.database;
    const { quotes } = schema;

    await db.insert(quotes).values({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      companyName: payload.companyName ?? null,
      vehicleType: payload.vehicleType,
      departureLocation: payload.departureLocation,
      arrivalLocation: payload.arrivalLocation,
      preferredDate: payload.preferredDate ? new Date(payload.preferredDate) : null,
      message: payload.message ?? null,
      status: 'new',
    });
  }
}
