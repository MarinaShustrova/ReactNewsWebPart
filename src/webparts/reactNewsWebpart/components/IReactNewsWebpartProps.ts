import {  WebPartContext } from "@microsoft/sp-webpart-base";
import { IPropertyFieldSite } from "@pnp/spfx-property-controls/lib/PropertyFieldSitePicker";

export interface IReactNewsWebpartProps {
  description: string;
  StyleToggle: string;
  AuthorToggle: string;
  DateToggle:string;
  sites: IPropertyFieldSite[];
  context: WebPartContext;
  Site: any[];
  onChangeProperty: any;
  search:string;
  onSave: (updatedNews:any[]) => void;
  News: any[],
  imageUrl: string;
  modalWindowEnabled: boolean;
  updateImageUrl: (imageUrl: string, newsId:number) => void;
  propertyPaneTextFieldValue: string;
  selectedNewsImageUrl: string;
  selectedNewsId: number,
  imageUrls: string[];
}
