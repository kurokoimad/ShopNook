package com.ShopNook.ecommerce.config;

import com.ShopNook.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.http.HttpMethod;


import java.util.*;

@Configuration
public class DataRestConfiguration implements RepositoryRestConfigurer
{
    // Inject the allowed origins from the application properties
    @Value("${allowed.origins}")
    private String[] myAllowedOrigins;

    // Autowire JPA entity manager
    private EntityManager entityManager;

    @Autowired
    public DataRestConfiguration(EntityManager myEntityManager)
    {
        entityManager = myEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors)
    {
        HttpMethod[] disallowedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};

        // Restricting HTTP methods(PUT, POST, DELETE) for All Classes
        restrictHttpMethods(Product.class, config, disallowedActions);

        restrictHttpMethods(ProductCategory.class, config, disallowedActions);

        restrictHttpMethods(Country.class, config, disallowedActions);

        restrictHttpMethods(State.class, config, disallowedActions);

        restrictHttpMethods(Order.class, config, disallowedActions);



        // calling internal helper method
        exposeIds(config);

        // cors mapping configuration
        cors.addMapping(config.getBasePath() + "/**").allowedOrigins(myAllowedOrigins);
    }

    private static void restrictHttpMethods(Class myClass, RepositoryRestConfiguration config, HttpMethod[] disallowedActions) {
        config.getExposureConfiguration()
                .forDomainType(myClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(disallowedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(disallowedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config)
    {
        // expose entity ids

        // get a list of all entity classes fromm the entity manager
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        // create an array of the entity types
        List<Class> entityOfClasses = new ArrayList<>();

        // get the entity types for the entities
        for (EntityType entityType: entities)
        {
            entityOfClasses.add(entityType.getJavaType());
        }

        // expose the entity ids for the array of entity/domain types
        Class[] domainTypes = entityOfClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
