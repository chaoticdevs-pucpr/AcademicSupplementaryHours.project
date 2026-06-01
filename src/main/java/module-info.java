module ash.crud {
    requires javafx.controls;
    requires javafx.fxml;


    opens ash.crud to javafx.fxml;
    exports ash.crud;
}