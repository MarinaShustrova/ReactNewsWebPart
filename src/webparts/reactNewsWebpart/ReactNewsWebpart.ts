import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import { BaseClientSideWebPart, PropertyPaneTextField } from '@microsoft/sp-webpart-base';
import * as strings from 'ReactNewsWebpartStrings';
import ReactNews from './components/ReactNewsWebpart';
import { IReactNewsWebpartProps } from './components/IReactNewsWebpartProps';;
import { IPropertyFieldSite, PropertyFieldSitePicker } from '@pnp/spfx-property-controls';

 export interface IImageUrl {
  newsId:number;
  imageUrl: string;
  image:any;
}

export interface IReactNewsWebpartWebPartProps {
  description: string;
  StyleToggle: string;
  AuthorToggle: string;
  DateToggle: string;
  sites: IPropertyFieldSite[];
  Site: any[];
  context: any;
  search: string;
  // searchByTitle: (searchText: string) => void;
  onSave: (updatedNews: any) => void;
  News: any[];
  imageUrl: string;
  modalWindowEnabled: boolean;
  updateImageUrl: (imageUrl: string, callback: () => void) => void;
  propertyPaneTextFieldValue: string;
  selectedNewsImageUrl: string;
  selectedNewsId: number,
  imageUrls: string[];
}

export interface IReactNewsWebpartWebPartState {
  selectedNewsImageUrl: string;
}

export default class ReactNewsWebpart extends BaseClientSideWebPart <IReactNewsWebpartProps> {
  state: { selectedNewsImageUrl: string; };
  constructor(props: IReactNewsWebpartProps) {
    super();
    this.state = {
      selectedNewsImageUrl: '',
    };
  }

   protected handleSaveNews: (updatedNews: any) => void;
  public render(): void {

    const element: React.ReactElement<IReactNewsWebpartProps> = React.createElement(
      ReactNews,
      {
        description: this.properties.description,
        StyleToggle: this.properties.StyleToggle,
        sites: this.properties.sites,
        context: this.context,
        AuthorToggle: this.properties.AuthorToggle,
        DateToggle: this.properties.DateToggle,
        Site: this.properties.Site,
        onChangeProperty: this.onChangeProperty,
        search: this.properties.search,
        // searchByTitle: this.searchByTitle,
        onSave: this.handleSaveNews,
        News: this.properties.News,
        imageUrl: this.properties.imageUrl,
        modalWindowEnabled: this.properties.modalWindowEnabled,
        updateImageUrl: this.updateImageUrl,
        propertyPaneTextFieldValue: this.properties.propertyPaneTextFieldValue,
        selectedNewsImageUrl: this.properties.selectedNewsImageUrl,
        selectedNewsId: this.properties.selectedNewsId,
        imageUrls: this.properties.imageUrls,
      }
    );
    ReactDom.render(element, this.domElement);
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  public async onInit(): Promise<void> {
  }

  public updateImageUrl(imageUrl: string, newsId: number): void {
    const updatedImageUrls: string[] = this.properties.imageUrls.map(image => {
      if (typeof image === 'string') {
        return image;
      }
      if (image === newsId) {

        return imageUrl;
      }
      return '';
    });
    this.properties.imageUrls = updatedImageUrls;
    this.onPropertyPaneFieldChanged('imageUrls', this.properties.imageUrls, this.properties.imageUrls);
  }

  protected onPropertyPaneFieldChanged(
    propertyPath: string,
    oldValue: any,
    newValue: any
  ): void {
    if (propertyPath === "sites") {
      const value: IPropertyFieldSite[] = newValue as IPropertyFieldSite[];
      if (value && !value.length) {
        this.properties.Site = [];
        this.context.propertyPane.refresh();
      } else {
        this.properties.Site = newValue;
        this.context.propertyPane.refresh();
      }
    } else if (propertyPath === "search") {
      // this.updateSearch(newValue as string);
    } else if (propertyPath === "modalWindowToggle") {
      this.properties.modalWindowEnabled = newValue;
      this.render();
    } else if (propertyPath === "imageUrls") {
      this.properties.imageUrls = newValue;
      this.render();
    }
  }

  public async getSelectedListFields() {
    if (this.properties.Site) {
      this.context.propertyPane.refresh();
    }
  }

  public onChangeProperty = (changeType: string, oldValue: any, newValue: any[]): void => {
        this.getSelectedListFields();
  }

private onNewsImageClick = (event: React.MouseEvent<HTMLImageElement>): void => {
  if (this.properties.modalWindowEnabled  === true) {
   return this.onNewsImageClick.apply(this)
  } else {
   return null;
  }
}

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupFields: [
                PropertyPaneToggle('StyleToggle', {
                  onText: 'Stack',
                  offText: 'Single',
                  label: 'Style'
                }),
                PropertyPaneToggle('AuthorToggle', {
                  onText: 'Hidden',
                  offText: 'Shown',
                  label: 'Author'
                }),
                PropertyPaneToggle('DateToggle', {
                  onText: 'Hidden',
                  offText: 'Shown',
                  label: 'Date'
                }),
                PropertyPaneToggle('modalWindowToggle', {
                  label: 'Enable Modal Window',
                  onText: 'Enabled',
                  offText: 'Disabled',
                }),
              //      PropertyPaneTextField('imageUrls', {
              //     label: "URL-адрес изображения",

              // }),
              // PropertyPaneTextField('search', {
              //   label: 'Search post'
              // }),

                PropertyFieldSitePicker('sites', {
                  label: 'Select sites',
                  initialSites: this.properties.sites,
                  context: this.context,
                  deferredValidationTime: 200,
                  multiSelect: true,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  key: 'sitesFieldId'
                }),

              ]
            }
          ]
        }
      ]
    };
  }
}


