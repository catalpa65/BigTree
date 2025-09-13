import { PartialType } from "@nestjs/mapped-types";
import { CreatePunchRecordDto } from "./create-punch-record.dto";

export class UpdatePunchRecordDto extends PartialType(CreatePunchRecordDto) {}
