import { MessageView, Presenter } from "./Presenter";

export interface LoadingMessageView extends MessageView {
  setIsLoading: (value: boolean) => void;
}

export abstract class LoadingMessagePresenter<
  V extends LoadingMessageView,
> extends Presenter<V> {
  protected async doFailureReportingOperationWithMessage(
    operation: () => Promise<void>,
    operationDescription: string,
    infoMessage: string,
  ) {
    let messageId = "";

    try {
      this.view.setIsLoading(true);
      messageId = this.view.displayInfoMessage(infoMessage, 0);
      await operation();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`,
      );
    } finally {
      this.view.deleteMessage(messageId);
      this.view.setIsLoading(false);
    }
  }
}
