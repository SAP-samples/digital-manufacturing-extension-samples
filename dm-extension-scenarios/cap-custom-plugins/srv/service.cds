using { dm.custom.schema as schema} from '../db/schema';


service EventsService {
  entity CustomEntitySet as projection on schema.CustomTable;
}