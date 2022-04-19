package com.prodcons.server;


import com.prodcons.server.graph.Graph;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

	public static void main(String[] args){
		SpringApplication.run(ServerApplication.class, args);
		Graph g = new Graph();
	}

}

