walker simple_walker {
    has user_id: int;
    
    can test_function with root entry {
        report {"status": "success", "message": "Simple test works"};
    }
}