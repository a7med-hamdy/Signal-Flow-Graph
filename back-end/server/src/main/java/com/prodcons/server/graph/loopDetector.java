package com.prodcons.server.graph;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import org.jgrapht.alg.cycle.HawickJamesSimpleCycles;
import org.jgrapht.graph.DefaultDirectedWeightedGraph;
import org.jgrapht.graph.DefaultWeightedEdge;
import com.google.common.collect.*;

public class loopDetector {
    private DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph;
    HawickJamesSimpleCycles<String, DefaultWeightedEdge> detector;
    public loopDetector(DefaultDirectedWeightedGraph<String, DefaultWeightedEdge> graph)
    {
        this.graph = graph;
        this.detector = new HawickJamesSimpleCycles<>(graph);
    }
    public List<List<List<String>>> getLoops()
    {
        return this.getNonTouchingLoops();
    }

    public List<List<List<String>>> getNonTouchingLoops()
    {
        List<List<List<String>>> answer = new ArrayList<>();
        List<List<String>> allLoops = this.detector.findSimpleCycles();
        for(List<String> l : allLoops){
            List<List<String >> list = new ArrayList<>();
            list.add(l);
            answer.add(list);
        }
        //answer.add(allLoops);
        // List<List<String>> li = Lists.cartesianProduct(allLoops);
        for(int i = 2; i <= allLoops.size(); i++)
        {
            Set<Set<List<String>>> set = Sets.combinations(Sets.newHashSet(allLoops), i);

            for(Set<List<String>> x: set)
            {
                boolean flag = true;
                List<List<String>> list = Lists.cartesianProduct(Lists.newArrayList(x));
                for(List<String> y : list)
                {
                    if(!this.isNonTouching(y))
                    {
                        flag = false;
                    }
                }
                if(flag)
                {
                    answer.add(Lists.newArrayList(x));
                }
            }
        }
        return answer;
    }
    private boolean isNonTouching(List<String> list)
    {
        return list.stream().distinct().count() == list.size();
    }
}
