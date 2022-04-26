package com.prodcons.server.Controllers;
import com.prodcons.server.graph.*;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class RequestsController {
    Graph SFG = new Graph();
    public String forward_paths;
    public String loops;
    public String non_touching_loops;
    public String paths_determinants;
    public String determinant;
    public String overall_gain;

    /****************************************************************
     * Craeation Graph requests                                     *
     ****************************************************************/
    //adding a node - post request
    @PostMapping("/+node/{name}")
    public boolean add_node(@PathVariable("name") String name){
        try{
            this.SFG.addVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //sets the input node
    @PostMapping("/input-node/{name}")
    public boolean set_input_node(@PathVariable("name") String name){
        try{
            this.SFG.setStartVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //sets the output node
    @PostMapping("/output-node/{name}")
    public boolean set_output_node(@PathVariable("name") String name){
        try{
            this.SFG.setEndVertex(name);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //adding an edge - post request
    @PostMapping("/+edge/{from}/{to}")
    public boolean add_edge(
        @PathVariable("from") String from,
        @PathVariable("to") String to)

    {
        try{
            this.SFG.addEdge(from, to);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //adding an edge with weight - post request
    @PostMapping("/+edge+weight/{from}/{to}/{weight}")
    public boolean add_edge_and_weight(
        @PathVariable("from") String from,
        @PathVariable("to") String to,
        @PathVariable("weight") Double weight)

    {
        try{
            this.SFG.addEdge(from, to, weight);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }

    //setting/updating an edge weight - post request
    @PostMapping("/set-edge-weight/{from}/{to}/{new_weight}")
    public boolean set_edge_weight(
        @PathVariable("from") String from,
        @PathVariable("to") String to,
        @PathVariable("new_weight") Double new_weight)

    {
        try{
            this.SFG.setEdgeWeight(from, to, new_weight);
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }


    //clear the whole graph to draw another one - delete request
    @DeleteMapping("/clear")
    public boolean clearGraph(){
        try{
            this.SFG = new Graph();
        }
        catch(Exception e){
            e.printStackTrace();
            return false;
        }
        return true;
    }


    /****************************************************************
     * Solution requests                                            *
     ****************************************************************/
    //checks if it's a valid Signal-Flow-Graph or not 
    @PostMapping("/validate")
    public boolean validate(){
        return this.SFG.isValid();
    }
    
    
    //solves & stores the solution
    @PostMapping("/solve")
    public boolean solve(){
        //solving the signal flow graph
        try{
            this.forward_paths      = this.SFG.getPaths();
            this.loops              = this.SFG.getAllLoops();
            this.non_touching_loops = this.SFG.getLoopsClassified();
            this.paths_determinants = this.SFG.calculatePathFactors();
            this.determinant        = this.SFG.calculateDeterminant();
            this.overall_gain       = this.SFG.getOverallGain();
            return true;
        }
        catch(Exception e){
            e.printStackTrace();
        }
        return false;
    }

    //forward paths get request
    @GetMapping("/solve/forward-paths")
    public String get_forward_paths(){
        return this.forward_paths;
    }

    //loops get request
    @GetMapping("/solve/loops")
    public String get_loops(){
        return this.loops;
    }

    //Non touching loops get request
    @GetMapping("/solve/non-touching-loops")
    public String get_non_touching_loops(){
        return this.non_touching_loops;
    }

    //determinants get request
    @GetMapping("/solve/paths-determinants")
    public String get_paths_determinants(){
        return this.paths_determinants;
    }

    //determinant get request
    @GetMapping("/solve/determinant")
    public String get_determinant(){
        return this.determinant;
    }

    //Overall gain (the result) get request
    @GetMapping("/solve/overall-gain")
    public String get_overall_gain(){
        return this.overall_gain;
    }
}
