import type {Request as Req} from 'express';
import {randomUUID} from 'crypto';
import ValueRepository from '../../../repository/ValueRepository';
import Value from '../../../models/db/Value';
import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Request,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from 'tsoa';
import {isAuthenticatedMiddleware} from '../../../middleware/auth';
import {UUID} from '../../../models/api/uuid';
import ApiBaseModelCreatedUpdated from '../../../models/api/ApiBaseModelCreatedUpdated';
import {UUID as nodeUUID} from 'node:crypto';

interface ValueVmV1 extends ApiBaseModelCreatedUpdated {
  reportId: UUID;
  labelId: UUID;
  value: number;
}

@Route('api/v1/values')
@Middlewares(isAuthenticatedMiddleware)
@Tags('values')
export class ValueController extends Controller {
  private repo = new ValueRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<ValueVmV1[]> {
    return this.repo.getAll(req.session.user!.id);
  }

  @Get('{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getById(@Path() id: UUID, @Request() req: Req): Promise<ValueVmV1> {
    const value = await this.repo.getById(req.session.user!.id, id as nodeUUID);
    if (value !== undefined) {
      return value;
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Post()
  @SuccessResponse(201, 'Created')
  async add(@Body() body: ValueVmV1, @Request() req: Req): Promise<ValueVmV1> {
    let value = Value.fromJson(body);

    value.id = randomUUID();
    value.createdBy = req.session.user!.id;
    value.updatedBy = req.session.user!.id;

    value = await this.repo.add(value);
    this.setStatus(201);
    return value;
  }

  @Put()
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async update(@Body() body: ValueVmV1, @Request() req: Req): Promise<ValueVmV1> {
    const value = Value.fromJson(body);

    //get from db
    const dbvalue = await this.repo.getById(value.id, req.session.user!.id);
    if (!dbvalue) {
      this.setStatus(404);
      return undefined as any;
    }

    //update props
    dbvalue.reportId = value.reportId;
    dbvalue.labelId = value.labelId;
    dbvalue.value = value.value;
    dbvalue.updatedBy = req.session.user!.id;

    //save
    const updated = await this.repo.update(dbvalue);
    if (updated) {
      return dbvalue;
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Put('report/{reportId}')
  @SuccessResponse(200, 'Ok')
  async updateBatchByReportId(@Path() reportId: UUID, @Body() body: ValueVmV1[], @Request() req: Req): Promise<ValueVmV1[]> {
    let values = body.map(e => Value.fromJson(e));

    values.forEach(value => {
      value.id = randomUUID();
      value.createdBy = req.session.user!.id;
      value.updatedBy = req.session.user!.id;
    });
    values = await Value.transaction(async trx => {
      await this.repo.removeByReportId(reportId as nodeUUID, req.session.user!.id, trx);
      return await this.repo.addBatch(values, trx);
    });
    return values;
  }

  @Delete('{id}')
  @SuccessResponse(204, 'Deleted')
  @Response(404, 'Not Found')
  async remove(@Path() id: UUID, @Request() req: Req): Promise<void> {
    const deleted = await this.repo.remove(id as nodeUUID, req.session.user!.id);
    if (deleted) {
      this.setStatus(204);
    } else {
      this.setStatus(404);
    }
  }
}
