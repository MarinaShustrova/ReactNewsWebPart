import *as React from 'react';
import { IReactNewsWebpartProps } from './IReactNewsWebpartProps';
import { IReactNewsWebpartState } from './IReactNewsWebpartState';
import SingleStyle from './SingleStyle';
import StackStyle from './StackStyle';
import EditNewsModal from './EditNewsModal';
import spservices from './Service/SPServices';

export default class ReactNewsWebpart extends React.Component<IReactNewsWebpartProps, IReactNewsWebpartState> {
  private _spservices: spservices;
  constructor(props: IReactNewsWebpartProps, state: IReactNewsWebpartState) {
    super(props);
    this.state = {
      SPGuid: '',
      News: [],
      Reload: false,
      showModal: false,
      editedNews: null,
      imageUrl: '',
      newsId: null,
      selectedNewsImageUrl: '',
      selectedNewsId: null,

    };
    console.log('props', this.props)
    this._spservices = new spservices(this.props.context);
  }

  // public componentDidMount() {
  //   this.Get('Default');
  // }

  public async componentDidMount() {
    this.Get('Default');
  }

  public componentDidUpdate(prevProps: IReactNewsWebpartProps) {
    if (prevProps.Site !== this.props.Site) {
      this.props.onChangeProperty("Sites");
      if (this.props.Site.length > 0) {
        this.Get('Update');
      }
      else {
        this.Get('Default');
      }

      this.setState({Reload: !this.state.Reload});
    }
  }

  public async Get(Choice) {
    var e: any[] = [];
    var URL: any;
    if (this.props.Site === undefined || this.props.Site.length < 1 || (Choice === 'Default' && this.props.Site.length < 1)) {
      const mockData = this._spservices.getMockData();
      e.push(...mockData.map(Post => ({
        Author: Post.Author,
        Title: Post.Title,
        Description: Post.Description,
        Id: Post.Id,
        Created: Post.Created,
        BannerImageUrl: Post.BannerImageUrl,
        Url: Post.Url,
      })));
    }
    else {
      this.props.Site.map(async site => {
        URL = site.url;
        const Info = await this._spservices.getInfo(URL);
        Info.map(async Post => {
          e.push({
            Author: Post.Author,
            Title: Post.Title,
            Description: Post.Description,
            Id: Post.Id,
            Created: Post.Created,
            Thumbnail: Post.BannerImageUrl,
            Url: Post.Url,
          });
          if (this.state.Reload === true) {
            this.setState({ News: e, Reload: false });
          }
          else { this.setState({ News: e }); }
        });
      });
    }
    this.setState({ News: e });
  }

  // public async Get(Choice) {
  //   console.log('choice', Choice);
  //   var e: any[] = [];
  //   var URL: any;
  //   if (this.props.Site === undefined || this.props.Site.length < 1 || (Choice === 'Default' && this.props.Site.length < 1)) {
  //     // Получение данных с сайта
  //     URL = this.props.context.pageContext.web.absoluteUrl;
  //     console.log('URL', URL);
  //     const Posts = await this._spservices.getInfo(URL);
  //     console.log('Posts', Posts);//* эта консоль возварщает 100 постов тут все ок !!!!!!!!
  //     Posts.map(async Post => {
  //       e.push({
  //         Author: Post.Author,
  //         Title: Post.Title,
  //         Description: Post.Description,
  //         Id: Post.Id,
  //         Created: Post.Created,
  //         Thumbnail: Post.BannerImageUrl,
  //         Url: Post.Url,
  //       });
  //       if (this.state.Reload === true) {
  //         this.setState({ News: e, Reload: false });
  //       } else {
  //         this.setState({ News: e });
  //       }
  //     });
  //   }
  //   // Добавление условия для перехода к моковым данным
  //   else if (Choice === 'MockData') {
  //     console.log('Inside MockData branch'); // Добавьте этот лог
  //     const mockData = this._spservices.getMockData();
  //     console.log('mockData', mockData);
  //     e.push(...mockData.map(Post => ({
  //       Author: Post.Author,
  //       Title: Post.Title,
  //       Description: Post.Description,
  //       Id: Post.Id,
  //       Created: Post.Created,
  //       Thumbnail: Post.BannerImageUrl,
  //       // BannerImageUrl: Post.BannerImageUrl,
  //       Url: Post.Url,
  //     })));
  //     this.setState({ News: e });
  //   }
  //   // Если ни одно из условий не выполнилось, то можно добавить обработку других случаев здесь

  //   else {
  //     this.props.Site.map(async site => {
  //       URL = site.url;
  //       console.log('URL2', URL);
  //       const Info = await this._spservices.getInfo(URL);
  //       Info.map(async Post => {
  //         e.push({
  //           Author: Post.Author,
  //           Title: Post.Title,
  //           Description: Post.Description,
  //           Id: Post.Id,
  //           Created: Post.Created,
  //           Thumbnail: Post.BannerImageUrl,
  //           Url: Post.Url,

  //         });
  //         if (this.state.Reload === true) {
  //           this.setState({ News: e, Reload: false });
  //         } else {
  //           this.setState({ News: e });
  //         }
  //       });
  //     });
  //   }
  //   this.setState({ News: e });
  // }


  public handleEditNews = (newsId: number,imageUrl: string) => {
    try {
      let newsToEdit = null;
      for (const news of this.state.News) {
        if (news.Id === newsId) {
          newsToEdit = news;
          break;
        }
      }
      this.setState({
        showModal: true,
        editedNews: newsToEdit,
        imageUrl: imageUrl,
      });
    } catch (error) {
      console.error('Error in handleEditNews in REACTnewsComp :', error);
    }
  };

  public handleSaveNews = (imageUrl: string, newsId: number) => {
    const updatedNews = this.state.News.map(news => {
        if (news.Id === newsId) {
        return {
          ...news,
          BannerImageUrl: imageUrl,
        };
      }
      return news;
    });
    this.setState({
      News: updatedNews,
      showModal: false,
    });
  };

  public handleCloseModal = () => {
    this.setState({
      showModal: false,
      editedNews: null,
    });
  };

  public updateImageUrlInWebPart = (imageUrl: string, newsId: number) => {
    this.handleSaveNews(imageUrl, newsId);
  };

  public render(): React.ReactElement<IReactNewsWebpartProps> {
    return <div style={{ height: '100%', width: '100%' }}>
      {this.props.StyleToggle ? (
        <StackStyle
          News={this.state.News}
          DateToggle={this.props.DateToggle}
          AuthorToggle={this.props.AuthorToggle}
          Reload={this.state.Reload}
          onEditNews={this.handleEditNews}
          showModal={this.state.editedNews !== null}
          modalWindowEnabled={this.props.modalWindowEnabled}
          updateImageUrl={this.updateImageUrlInWebPart}
          imageUrl={this.props.imageUrl}
          context={this.props.context}
          propertyPaneTextFieldValue={this.props.propertyPaneTextFieldValue}
          selectedNewsImageUrl={this.props.selectedNewsImageUrl}        >
        </StackStyle>
      ) : (
        <SingleStyle
            News={this.state.News}
            DateToggle={this.props.DateToggle}
            AuthorToggle={this.props.AuthorToggle}
            Reload={this.state.Reload}
            onEditNews={this.handleEditNews}
            showModal={this.state.editedNews !== null}
            modalWindowEnabled={this.props.modalWindowEnabled}
            updateImageUrl={this.updateImageUrlInWebPart}
            imageUrl={this.props.imageUrl}
            context={this.props.context}
            propertyPaneTextFieldValue={this.props.propertyPaneTextFieldValue}
            selectedNewsImageUrl={this.props.selectedNewsImageUrl}               >
        </SingleStyle>
      )}
      {this.state.showModal && this.props.modalWindowEnabled && (
        <EditNewsModal
          onClose={this.handleCloseModal}
          // onSave={this.handleSaveNews}
          onSave={(imageUrl, newsId) => this.handleSaveNews(imageUrl, newsId)}
          // onSave={(imageUrl) => this.props.updateImageUrl(imageUrl, this.state.newsId)} // Передача ID поста
          modalWindowEnabled={this.props.modalWindowEnabled}
          // imageUrl={this.props.imageUrl}
          updateImageUrl={this.props.updateImageUrl}
          imageUrl={this.state.selectedNewsImageUrl}
          newsId={this.state.newsId}
        />
      )}
    </div>;
  }
}
