package ash.crud;

import javafx.application.Application;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Pos;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.HBox;
import javafx.scene.text.Font;
import javafx.stage.Stage;

public class Application0 extends Application {
    @Override
    public void start(Stage stage) throws Exception {
        stage.setTitle("Título");
        Label lbl1 = new Label("Label");
        lbl1.setFont(new Font("Arial", 24));
        lbl1.setAlignment(Pos.CENTER);
        Scene scene = new Scene(lbl1, 500, 300);
        stage.setScene(scene);
        stage.show();
    }
    public static void main(String[] args){
        launch();
    }
}
