import type {Request as Req} from 'express';
import {randomUUID} from 'crypto';
import ReportRepository from '../../../repository/ReportRepository';
import Report from '../../../models/db/Report';
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

interface ReportVmV1 extends ApiBaseModelCreatedUpdated {
  date: Date;
  /**
   * @maxLength 255
   */
  name: string;
  /**
   * @maxLength 255
   */
  lab: string;
  /**
   * @maxLength 32767
   */
  comment: string;
}

@Route('api/v1/reports')
@Middlewares(isAuthenticatedMiddleware)
@Tags('reports')
export class ReportController extends Controller {
  private repo = new ReportRepository();

  @Get()
  @SuccessResponse(200, 'Ok')
  async list(@Request() req: Req): Promise<ReportVmV1[]> {
    return this.repo.getAll(req.session.user!.id);
  }

  @Get('{id}')
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async getById(@Path() id: UUID, @Request() req: Req): Promise<ReportVmV1> {
    const report = await this.repo.getById(req.session.user!.id, id);
    if (report !== undefined) {
      return report;
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Post()
  @SuccessResponse(201, 'Created')
  async add(@Body() body: ReportVmV1, @Request() req: Req): Promise<ReportVmV1> {
    let report = Report.fromJson(body);

    report.id = randomUUID();
    report.createdBy = req.session.user!.id;
    report.updatedBy = req.session.user!.id;

    report = await this.repo.add(report);
    this.setStatus(201);
    return report;
  }

  @Put()
  @SuccessResponse(200, 'Ok')
  @Response(404, 'Not Found')
  async update(@Body() body: ReportVmV1, @Request() req: Req): Promise<ReportVmV1> {
    const report = Report.fromJson(body);

    //get from db
    const dbreport = await this.repo.getById(report.id, req.session.user!.id);
    if (!dbreport) {
      this.setStatus(404);
      return undefined as any;
    }

    //update props
    dbreport.date = report.date;
    dbreport.name = report.name;
    dbreport.lab = report.lab;
    dbreport.comment = report.comment;
    dbreport.updatedBy = req.session.user!.id;

    //save
    const updated = await this.repo.update(dbreport);
    if (updated) {
      return dbreport;
    } else {
      this.setStatus(404);
      return undefined as any;
    }
  }

  @Delete('{id}')
  @SuccessResponse(204, 'Deleted')
  @Response(404, 'Not Found')
  async remove(@Path() id: UUID, @Request() req: Req): Promise<void> {
    const deleted = await this.repo.remove(id, req.session.user!.id);
    if (deleted) {
      this.setStatus(204);
    } else {
      this.setStatus(404);
    }
  }
}
