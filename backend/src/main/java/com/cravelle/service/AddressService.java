package com.cravelle.service;

import com.cravelle.dto.AddressDTO;
import com.cravelle.entity.Address;
import com.cravelle.entity.User;
import com.cravelle.exception.ResourceNotFoundException;
import com.cravelle.repository.AddressRepository;
import com.cravelle.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(AddressRepository addressRepository, UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AddressDTO> getUserAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIdDesc(userId).stream()
                .map(AddressDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public AddressDTO createAddress(Long userId, AddressDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (Boolean.TRUE.equals(dto.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(existing -> {
                existing.setIsDefault(false);
                addressRepository.save(existing);
            });
        }

        Address address = new Address();
        address.setUser(user);
        address.setLabel(dto.getLabel() != null ? dto.getLabel() : "Home");
        address.setStreet(dto.getStreet());
        address.setArea(dto.getArea() != null ? dto.getArea() : "Central");
        address.setCity(dto.getCity() != null ? dto.getCity() : "Bangalore");
        address.setPincode(dto.getPincode());
        address.setLatitude(dto.getLatitude());
        address.setLongitude(dto.getLongitude());
        address.setIsDefault(Boolean.TRUE.equals(dto.getIsDefault()));

        Address saved = addressRepository.save(address);
        return AddressDTO.fromEntity(saved);
    }

    public AddressDTO updateAddress(Long userId, Long addressId, AddressDTO dto) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));

        if (Boolean.TRUE.equals(dto.getIsDefault()) && !Boolean.TRUE.equals(address.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(userId).ifPresent(existing -> {
                existing.setIsDefault(false);
                addressRepository.save(existing);
            });
        }

        if (dto.getLabel() != null) address.setLabel(dto.getLabel());
        if (dto.getStreet() != null) address.setStreet(dto.getStreet());
        if (dto.getArea() != null) address.setArea(dto.getArea());
        if (dto.getCity() != null) address.setCity(dto.getCity());
        if (dto.getPincode() != null) address.setPincode(dto.getPincode());
        if (dto.getLatitude() != null) address.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) address.setLongitude(dto.getLongitude());
        if (dto.getIsDefault() != null) address.setIsDefault(dto.getIsDefault());

        Address saved = addressRepository.save(address);
        return AddressDTO.fromEntity(saved);
    }

    public void deleteAddress(Long userId, Long addressId) {
        Address address = addressRepository.findByIdAndUserId(addressId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with ID: " + addressId));
        addressRepository.delete(address);
    }
}
