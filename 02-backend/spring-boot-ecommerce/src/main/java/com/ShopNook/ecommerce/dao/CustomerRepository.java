package com.ShopNook.ecommerce.dao;

import com.ShopNook.ecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long>
{
    Customer findByEmail(String c_email);
}
